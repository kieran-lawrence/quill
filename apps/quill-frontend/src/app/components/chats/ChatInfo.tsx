'use client'

import styled from 'styled-components'

export const ChatInfo = ({ isVisible }: { isVisible: boolean }) => {
    return <SChatInfo $isVisible={isVisible}></SChatInfo>
}
const SChatInfo = styled.aside<{ $isVisible: boolean }>`
    margin-left: ${(props) => (props.$isVisible ? '0.5rem' : '0')};
    display: flex;
    height: 100%;
    background: #f2f2f2;
    border-radius: 0.5rem;
    width: ${(props) => (props.$isVisible ? '18vw' : '0')};
    transition: all 0.2s;
`
