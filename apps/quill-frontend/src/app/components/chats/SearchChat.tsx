import { Chat, GroupChat } from '@quill/data'
import styled from 'styled-components'

type Props = {
    isVisible: boolean
    chat: GroupChat | Chat
}

export const SearchChat = ({ isVisible, chat }: Props) => {
    return <SSearchChat $isVisible={isVisible}>Search</SSearchChat>
}

const SSearchChat = styled.aside<{ $isVisible: boolean }>`
    margin-left: ${(props) => (props.$isVisible ? '0.5rem' : '0')};
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 0.5rem;
    border-radius: 0.5rem;
    width: ${(props) => (props.$isVisible ? '18vw' : '0')};
    transition: all 0.2s;
    background: ${({ theme }) => theme.colors.backgroundPrimary};
    h3 {
        font-size: 1.1rem;
    }
    opacity: ${(props) => (props.$isVisible ? '1' : '0')};
`
