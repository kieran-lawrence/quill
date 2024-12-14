'use client'

import styled from 'styled-components'

type ContextMenuProps = {
    menuHeading?: string
    children: React.ReactNode
    points: { x: number; y: number }
    width: number
    handleClose: () => void
}

export const ContextMenu = ({
    menuHeading,
    children,
    points,
    width,
    handleClose,
}: ContextMenuProps) => {
    const screenWidth = window.innerWidth
    const adjustedLeft =
        points.x + width * (screenWidth / 100) > screenWidth
            ? points.x - width * (screenWidth / 100)
            : points.x

    return (
        <SContextMenuWrapper
            $top={points.y}
            $left={adjustedLeft}
            $width={width}
            onMouseLeave={handleClose}
        >
            {menuHeading && <h4>{menuHeading}</h4>}
            {children}
        </SContextMenuWrapper>
    )
}
export const SContextMenuWrapper = styled.div<{
    $top: number
    $left: number
    $width: number
}>`
    border-radius: 1rem;
    box-sizing: border-box;
    position: fixed;
    background-color: #f2f2f2;
    box-shadow: 0 0 0.3rem #000000b2;
    top: ${(props) => props.$top}px;
    left: ${(props) => props.$left}px;
    width: ${(props) => props.$width}vw;
    min-width: 10rem;
    padding: 0.5rem;

    h4 {
        padding: 0.2rem 0;
    }
    ul {
        list-style: none;
        margin: 0;
        padding: 0.5rem;
    }
    li {
        padding: 0.5rem;
        border-radius: 0.5rem;

        &:is(:hover, :focus) {
            background: #f4e7d8;
            cursor: pointer;
        }
    }
`
