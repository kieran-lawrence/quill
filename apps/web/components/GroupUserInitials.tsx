import styled from 'styled-components'

type Props = {
    text: string
    size?: string
    fontSize?: string
}
export const GroupUserInitials = ({
    text,
    size = '4rem',
    fontSize = '2.5rem',
}: Props) => {
    // Split the name into words and take the first letter of each word, then extract the first 2 letters
    const initials = text
        ?.split(' ')
        .map((word) => word.substring(0, 1))
        .join('')
        .substring(0, 2)
        .toUpperCase()
    return (
        <SAvatar $size={size} $fontSize={fontSize}>
            {initials}
        </SAvatar>
    )
}

const SAvatar = styled.div<{ $size: string; $fontSize: string }>`
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${(props) => props.$size};
    width: ${(props) => props.$size};
    padding: 0.5rem;
    box-sizing: border-box;
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.colors.dark};
    font-size: ${({ $fontSize }) => $fontSize};
    color: ${({ theme }) => theme.colors.text.light};
`
