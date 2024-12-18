import styled from 'styled-components'

type QuillButtonProps = {
    text: string
    type: 'filled' | 'outlined'
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
    background: ${({ type, theme }) =>
        type === 'filled' ? theme.colors.blueStrong : 'transparent'};
    padding: 12px 20px;
    font-size: 18px;
    font-weight: 500;
    border-radius: 8px;
    color: ${({ type, theme }) =>
        type === 'filled'
            ? theme.colors.text.light
            : theme.colors.text.primary};
    outline: none;
    transition: all 0.2s;
    &:hover {
        cursor: pointer;
        opacity: 0.8;
    }
`
