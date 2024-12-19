import { User } from '@quill/data'
import styled from 'styled-components'
import { Avatar } from '../Avatar'
import { GroupUserInitials } from '../GroupUserInitials'
import { OnlineStatus } from '../OnlineStatus'
import { useEffect, useRef } from 'react'

type Props = {
    user: User
    handleClose: () => void
}
export const ProfileMenu = ({ user, handleClose }: Props) => {
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                handleClose()
            }
        }
        const handleKeydown = (e: KeyboardEvent) =>
            e.key === 'Escape' && handleClose()
        document.addEventListener('keyup', handleKeydown)
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('keyup', handleKeydown)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [handleClose])

    return (
        <SProfileMenu ref={menuRef}>
            <SUserOverview>
                {user.avatar ? (
                    <Avatar imgSrc={`/images/${user.avatar}`} size="3rem" />
                ) : (
                    <GroupUserInitials
                        text={`${user.firstName} ${user.lastName}`}
                        size="3rem"
                        fontSize="2rem"
                    />
                )}
                <div className="userInfo">
                    {user.firstName} {user.lastName}
                    <span>
                        <OnlineStatus
                            userId={user.id}
                            overrideStatus={user.onlineStatus}
                        />{' '}
                        {user.onlineStatus}
                    </span>
                </div>
            </SUserOverview>
            <SProfileOptions>
                <li>
                    Set yourself as{' '}
                    <strong>
                        {user.onlineStatus === 'online' ? 'away' : 'online'}
                    </strong>
                </li>
                <li></li>
                <li>Profile</li>
                <li>Sign Out</li>
            </SProfileOptions>
        </SProfileMenu>
    )
}
const SProfileMenu = styled.div`
    position: absolute;
    bottom: 2rem;
    left: 3.5rem;
    width: 15rem;
    height: 14rem;
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    border: ${({ theme }) => `1px solid ${theme.colors.text.weak}`};
    color: ${({ theme }) => theme.colors.text.primary};
    z-index: 99;
    border-radius: 0.5rem;
    padding: 1rem;
    box-sizing: border-box;
`
const SUserOverview = styled.address`
    display: flex;
    font-style: normal;

    .userInfo {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.1rem;
        text-transform: capitalize;
        padding: 0 0.5rem;
        font-weight: 500;
        font-size: 1rem;
        span {
            display: flex;
            align-items: center;
            gap: 0.3rem;
            font-size: 0.85rem;
            font-weight: 400;
        }
    }
`
const SProfileOptions = styled.ul`
    list-style: none;
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    li {
        padding: 0.25rem 0.5rem;
        border-radius: 0.5rem;
    }
    li:hover {
        cursor: pointer;
        background: ${({ theme }) => theme.colors.blueAccent};
    }

    li:nth-child(2) {
        border-bottom: ${({ theme }) => `1px solid ${theme.colors.text.weak}`};
        padding: 0.25rem 0;
        border-radius: 0;
        &:hover {
            cursor: default;
            background: initial;
        }
    }
`
