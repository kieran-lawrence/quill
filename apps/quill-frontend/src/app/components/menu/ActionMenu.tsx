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
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2rem;
    gap: 1rem;
    box-sizing: border-box;
    z-index: 2;

    h2 {
        font-weight: 500;
    }
    p {
        font-weight: 400;
    }
    .buttonWrapper {
        display: flex;
        width: 100%;
        justify-content: flex-end;
        gap: 0.5rem;

        .confirm {
            background: ${({ theme }) => theme.colors.blueStrong};
            color: ${({ theme }) => theme.colors.text.light};
            border: none;
        }
        .cancel {
            border: 2px solid ${({ theme }) => theme.colors.blueStrong};
        }
        .confirm,
        .cancel {
            padding: 0.4rem 0.8rem;
            border-radius: 0.5rem;

            outline: none;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;

            &:is(:hover, :focus) {
                opacity: 0.8;
            }
            transition: all 0.2s;
        }
    }
`
