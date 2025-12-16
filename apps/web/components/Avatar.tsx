import styled from 'styled-components'

type AvatarProps = {
    imgSrc: string
    size?: string
}
export const Avatar = ({ imgSrc, size = '4rem' }: AvatarProps) => {
    return <SAvatar src={imgSrc} alt="Avatar" $size={size} />
}

const SAvatar = styled.img<{ $size: string }>`
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${(props) => props.$size};
    width: ${(props) => props.$size};
    aspect-ratio: 1 / 1;
    border-radius: 0.5rem;
`
