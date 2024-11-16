import styled from 'styled-components'

type AvatarProps = {
    imgSrc: string
}
export const Avatar = ({ imgSrc }: AvatarProps) => {
    return <SAvatar src={imgSrc} alt="Avatar" />
}

const SAvatar = styled.img`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 4rem;
    width: 4rem;
    aspect-ratio: 1 / 1;
    border-radius: 0.5rem;
`
