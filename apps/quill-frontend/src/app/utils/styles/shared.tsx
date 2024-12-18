import styled from 'styled-components'

export const SChatContainer = styled.div`
    display: flex;
    height: 100%;
    flex: 1;
    background: ${({ theme }) => theme.colors.backgroundPrimary};
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
`
export const SFocusedContentContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #0000008e;
    display: grid;
    place-items: center;
`
