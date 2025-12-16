import styled from 'styled-components'

type ButtonStyles = 'filled' | 'outlined'
type QuillButtonProps = {
    text: string
    style: ButtonStyles
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
    isDisabled?: boolean
    onClick?: () => void
}
export const QuillButton = ({
    text,
    isDisabled,
    style,
    type = 'submit',
    onClick,
}: QuillButtonProps) => {
    return (
        <SButton
            $style={style}
            disabled={isDisabled}
            type={type}
            onClick={onClick}
        >
            {text}
        </SButton>
    )
}
const SButton = styled.button<{ $style: ButtonStyles }>`
    border: none;
    background: ${({ $style, theme }) =>
        $style === 'filled' ? theme.colors.blueStrong : 'transparent'};
    padding: 12px 20px;
    font-size: 18px;
    font-weight: 500;
    border-radius: 8px;
    color: ${({ $style, theme }) =>
        $style === 'filled'
            ? theme.colors.text.light
            : theme.colors.text.primary};
    outline: none;
    transition: all 0.2s;
    &:hover {
        cursor: pointer;
        opacity: 0.8;
    }
`
