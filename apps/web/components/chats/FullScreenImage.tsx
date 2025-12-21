import React from 'react'
import styled from 'styled-components'
import { isGif } from '../../utils/helpers'

type FullscreenImageProps = {
    imagePath: string
    onClose: () => void
}

export const FullscreenImage: React.FC<FullscreenImageProps> = ({
    imagePath,
    onClose,
}) => {
    return (
        <SOverlay onClick={onClose}>
            <SImage
                src={isGif(imagePath) ? imagePath : `/images/${imagePath}`}
                alt="Fullscreen"
                onClick={(e) => e.stopPropagation()}
            />
        </SOverlay>
    )
}

const SOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.colors.text.weak};
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`

const SImage = styled.img`
    max-width: 90%;
    max-height: 90%;
    border-radius: 0.5rem;
`
