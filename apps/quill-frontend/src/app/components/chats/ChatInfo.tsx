'use client'

import styled from 'styled-components'
import { GroupChat } from '../../utils/types'
import { useAuth } from '../../contexts/auth'
import { GroupUserInitials } from '../GroupUserInitials'
import { Avatar } from '../Avatar'
import { isGroupChatCreator } from '../../utils/helpers'
import { useState } from 'react'
import { RenameGroupMenu } from '../menu/RenameGroupMenu'

type Props = {
    isVisible: boolean
    chat: GroupChat
}

export const ChatInfo = ({ isVisible, chat }: Props) => {
    const { user } = useAuth()
    const isCreator = isGroupChatCreator(chat, user)
    const [editing, setEditing] = useState(false)

    return (
        <>
            {editing && (
                <RenameGroupMenu
                    groupId={chat.id}
                    onCancel={() => setEditing(false)}
                />
            )}
            <SChatInfo $isVisible={isVisible}>
                <SChatActions $isVisible={isVisible}>
                    <h3>Chat Actions</h3>
                    <ul className="actionsList">
                        {isCreator && (
                            <li onClick={() => setEditing(!editing)}>
                                Rename Group
                            </li>
                        )}
                        {isCreator && <li>Delete Group</li>}
                        {isCreator && <li>Change Cover Photo</li>}
                        {!isCreator && <li>Leave</li>}
                    </ul>
                </SChatActions>
                <SChatMembers $isVisible={isVisible}>
                    <h3>{chat.members.length} members</h3>
                    {chat.members.map((member) => (
                        <SMemberWrapper key={member.id}>
                            {member.avatar ? (
                                <Avatar
                                    imgSrc={`/images/${member.avatar}`}
                                    size="3.5rem"
                                />
                            ) : (
                                <GroupUserInitials
                                    text={`member`}
                                    size="3.5rem"
                                />
                            )}

                            {`${member.firstName} ${member.lastName}`}
                            <p>{member.id === chat.creator.id && 'admin'}</p>
                        </SMemberWrapper>
                    ))}
                </SChatMembers>
            </SChatInfo>
        </>
    )
}
const SChatInfo = styled.aside<{ $isVisible: boolean }>`
    margin-left: ${(props) => (props.$isVisible ? '0.5rem' : '0')};
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 0.5rem;
    border-radius: 0.5rem;
    width: ${(props) => (props.$isVisible ? '18vw' : '0')};
    transition: all 0.2s;
    h3 {
        font-size: 1.1rem;
    }
`
const SChatActions = styled.div<{ $isVisible: boolean }>`
    opacity: ${(props) => (props.$isVisible ? '1' : '0')};
    padding: 1rem;
    display: flex;
    flex-direction: column;
    height: 50%;
    border-radius: 0.5rem;
    box-sizing: border-box;
    background: #f2f2f2;
    transition: all 0.2s;

    h3 {
        margin-bottom: 1rem;
    }
    .actionsList {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        li {
            margin: 0;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            &:is(:hover, :focus) {
                cursor: pointer;
                background: #f4e7d8;
            }
        }
    }
`
const SChatMembers = styled.div<{ $isVisible: boolean }>`
    opacity: ${(props) => (props.$isVisible ? '1' : '0')};
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex: 1;
    border-radius: 0.5rem;
    box-sizing: border-box;
    background: #f4e7d8;
    transition: all 0.2s;
    gap: 0.5rem;
`
const SMemberWrapper = styled.address`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-style: normal;
    font-weight: 500;

    p {
        color: #562e00;
        padding-left: 0.5rem;
        font-weight: 400;
    }
`