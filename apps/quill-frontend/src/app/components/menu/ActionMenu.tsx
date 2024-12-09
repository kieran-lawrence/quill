import styled from 'styled-components'
import { SFocusedContentContainer } from '../../utils/styles/shared'
import { PropsWithChildren } from 'react'

type Props = {
    menuHeading: string
    menuText: string
    onConfirm: () => void
    onCancel: () => void
    confirmText: string
    cancelText: string
}
export const ActionMenu = ({
    menuHeading,
    menuText,
    onConfirm,
    onCancel,
    children,
    confirmText,
    cancelText,
}: PropsWithChildren<Props>) => {
    return (
        <SFocusedContentContainer>
            <SActionMenu>
                <h2>{menuHeading}</h2>
                <p>{menuText}</p>
                {children}
                <div className="buttonWrapper">
                    <button className="confirm" onClick={onConfirm}>
                        {confirmText}
                    </button>
                    <button className="cancel" onClick={onCancel}>
                        {cancelText}
                    </button>
                </div>
            </SActionMenu>
        </SFocusedContentContainer>
    )
}
const SActionMenu = styled.div`
    width: 20vw;
    height: fit-content;
    background: #f4e7d8;
    box-shadow: 0 0 0.3rem #000000b2;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2rem;
    gap: 1rem;
    box-sizing: border-box;

    p {
        font-weight: 500;
    }
    .buttonWrapper {
        display: flex;
        width: 100%;
        justify-content: flex-end;
        gap: 0.5rem;

        .confirm,
        .cancel {
            padding: 0.4rem 0.8rem;
            border-radius: 0.5rem;
            border: none;
            outline: none;
            cursor: pointer;
            font-size: 1rem;
        }
    }
`
