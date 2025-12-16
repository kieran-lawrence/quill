import styled from 'styled-components'
import { QuillLogo } from '../QuillLogo'
import { IoChatbox } from 'react-icons/io5'
import { IconContext } from 'react-icons'
import { IconWithText } from '../shared/IconWithText'
import { Avatar } from '../Avatar'
import { useAuth } from '../../contexts/auth'
import { GroupUserInitials } from '../GroupUserInitials'
import { OnlineStatus } from '@repo/api'
import { useState } from 'react'
import { ProfileMenu } from '../menu/ProfileMenu'

export const Sidebar = () => {
    const { user } = useAuth()
    const [showProfileOptions, setShowProfileOptions] = useState(false)

    return (
        <IconContext.Provider value={{ className: 'sidebarIcons' }}>
            <SSidebar>
                <QuillLogo />
                <SChatGroups>
                    <IconWithText
                        icon={<IoChatbox />}
                        text={'Chats'}
                        onClick={() => {
                            console.log('Clicked')
                            //TODO: Handle click of chats
                        }}
                    />
                </SChatGroups>
                {user && showProfileOptions && (
                    <ProfileMenu
                        user={user}
                        handleClose={() => setShowProfileOptions(false)}
                    />
                )}
                {user && (
                    <SProfile
                        $status={user.onlineStatus}
                        onClick={() =>
                            setShowProfileOptions(!showProfileOptions)
                        }
                    >
                        {user.avatar ? (
                            <Avatar
                                imgSrc={`/images/${user.avatar}`}
                                size="3rem"
                            />
                        ) : (
                            <GroupUserInitials
                                text={`${user.firstName} ${user.lastName}`}
                                size="3rem"
                                fontSize="2rem"
                            />
                        )}
                    </SProfile>
                )}
            </SSidebar>
        </IconContext.Provider>
    )
}
const SSidebar = styled.aside`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 3rem;
    min-width: 4rem;
    width: 4rem;
    height: 100%;
    padding: 2rem 1rem 2rem 0;
    box-sizing: border-box;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text.light};
    position: relative;
`
const SChatGroups = styled.div`
    flex: 1;
`
const SProfile = styled.div<{ $status: OnlineStatus }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    font-size: 0.9rem;
    position: relative;
    border: ${({ theme }) => `1px solid ${theme.colors.backgroundPrimary}`};
    border-radius: 0.5rem;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        box-sizing: border-box;
        background: ${({ $status, theme }) =>
            $status === 'offline'
                ? theme.colors.userStatus.offline.background
                : theme.colors.userStatus[$status]};
        border: ${({ $status, theme }) =>
            $status === 'offline'
                ? `2px solid ${theme.colors.userStatus.offline.border}`
                : `2px solid ${theme.colors.userStatus[$status]}`};
        outline: ${({ theme }) => `2px solid ${theme.colors.dark}`};
    }

    &:hover {
        cursor: pointer;
    }
`
