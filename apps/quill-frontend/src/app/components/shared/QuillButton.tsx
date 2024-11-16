import styled from 'styled-components'

type QuillButtonProps = {
    text: string
    type: 'filled' | 'outlined'
    outlineOffset?: string
    isDisabled?: boolean
    onClick?: () => void
}
export const QuillButton = ({
    text,
    isDisabled,
    ...rest
}: QuillButtonProps) => {
    return (
        <SButton {...rest} disabled={isDisabled}>
            {text}
        </SButton>
    )
}
const SButton = styled.button<Omit<QuillButtonProps, 'text'>>`
    border: none;
    background: ${(props) =>
        props.type === 'filled' ? '#f28140' : 'transparent'};
    padding: 12px 20px;
    font-size: 18px;
    font-weight: 600;
    border-radius: 8px;
    color: ${(props) => (props.type === 'filled' ? '#f8f8f8' : '#111')};
    outline: 2px solid #f28140;
    transition: all 0.1s;
    &:hover {
        cursor: pointer;
        outline-offset: ${(props) => props.outlineOffset ?? 0};
    }
`
