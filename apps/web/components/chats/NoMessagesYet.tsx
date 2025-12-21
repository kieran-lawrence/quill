import React, { useRef } from 'react'
import styled from 'styled-components'

export const NoMessagesYet: React.FC = () => {
    const message = useRef(
        messages[Math.floor(Math.random() * messages.length)],
    )
    return <SContainer>{message.current}</SContainer>
}

const SContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 100%;
    font-size: 1.3rem;
    color: ${({ theme }) => theme.colors.text.primary};
`

const messages = [
    'It’s quiet in here… Too quiet. Are we waiting for the perfect words?',
    'No messages yet? Guess the conversation’s still in beta!',
    'The chat is empty, but the potential is limitless!',
    'Hello? Testing... testing… Is this thing on?',
    'Tumbleweeds rolling through… Wanna break the silence?',
    'The only thing missing here is the first message. You in?',
    'A message is worth a thousand words. Or just one. Your move!',
    `The conversation hasn't started yet. But hey, no pressure!`,
    'This chat is like a blank canvas. Ready to paint it?',
    `Looks pretty quiet here... Start the conversation!`,
]
