'use client'

import styled from 'styled-components'

type IconWithTextProps = {
    icon: JSX.Element
    text: string
    onClick: () => void
}
export const IconWithText = ({ icon, text, onClick }: IconWithTextProps) => (
    <SIconWithText tabIndex={0} onClick={onClick}>
        {icon}
        {text}
    </SIconWithText>
)
const SIconWithText = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.2rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    transition: all 0.2s;
    outline: none;
    text-align: center;

    .sidebarIcons {
        width: 26px;
        height: 26px;
    }
    &:is(:hover, :focus) {
        background: #6e6e6e69;
        cursor: pointer;
    }
`
