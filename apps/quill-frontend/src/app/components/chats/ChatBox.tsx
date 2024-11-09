import styled from 'styled-components'
import { GroupMessage, PrivateMessage } from '../../utils/types'
import { useAuth } from '../../contexts/auth'

type ChatBoxProps = {
    message: PrivateMessage | GroupMessage
}
export const ChatBox = ({ message }: ChatBoxProps) => {
    const { user } = useAuth()
    const isAuthor = user?.id === message.author.id
    return (
        <SChatBox $isAuthor={isAuthor}>
            <SUserAvatar
                src="https://i.pravatar.cc/50?u=a042581f4e29026704d" // TODO: add user avatar
                alt={message.author.firstName}
            />
            <SChat $isAuthor={isAuthor}>
                {!isAuthor && (
                    <h3>{`${message.author.firstName} ${message.author.lastName}`}</h3>
                )}
                <p>{message.messageContent}</p>
            </SChat>
        </SChatBox>
    )
}
const SChatBox = styled.address<{ $isAuthor: boolean }>`
    display: flex;
    align-items: flex-end;
    flex-direction: ${({ $isAuthor }) => ($isAuthor ? 'row-reverse' : 'row')};
    align-self: ${({ $isAuthor }) => ($isAuthor ? 'flex-end' : 'flex-start')};
    gap: 0.5rem;
    width: fit-content;
    max-width: 55%;
    font-style: normal;
`
const SUserAvatar = styled.img`
    display: flex;
    height: 4rem;
    aspect-ratio: 1 / 1;
    border-radius: 0.5rem;
`
const SChat = styled.div<{ $isAuthor: boolean }>`
    background: ${({ $isAuthor }) => ($isAuthor ? '#ff971f' : '#f4e7d8')};
    color: ${({ $isAuthor }) => ($isAuthor ? '#f6f6f6' : '#1e1e1e')};
    flex: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 0.5rem;

    h3 {
        font-size: 1.1rem;
        font-weight: 500;
        color: #562e00;
    }
`
