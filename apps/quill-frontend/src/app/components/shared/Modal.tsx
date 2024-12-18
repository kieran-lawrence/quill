import { PropsWithChildren, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { IoClose } from 'react-icons/io5'

type ModalProps = {
    title: string
    onClose: () => void
    /** The dimensions of the modal viewport width/height */
    modalSize?: { width: number; height: number }
}

export const Modal = ({
    title,
    children,
    onClose,
    modalSize = { width: 40, height: 50 },
}: PropsWithChildren<ModalProps>) => {
    const modalRef = useRef<HTMLDivElement>(null)

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current === e.target) onClose()
    }

    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) =>
            e.key === 'Escape' && onClose()
        document.addEventListener('keydown', handleKeydown)
        return () => document.removeEventListener('keydown', handleKeydown)
    }, [onClose])

    return (
        <SModalOverlay ref={modalRef} onClick={handleOverlayClick}>
            <SModalContent $modalSize={modalSize}>
                <SModalHeader>
                    <h2>{title}</h2>
                    <IoClose
                        size={26}
                        onClick={onClose}
                        className="closeIcon"
                    />
                </SModalHeader>
                {children}
            </SModalContent>
        </SModalOverlay>
    )
}

const SModalOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #0000008e;
    display: grid;
    place-items: center;
`

const SModalContent = styled.div<{
    $modalSize?: { width: number; height: number }
}>`
    width: ${({ $modalSize }) => $modalSize?.width}vw;
    height: ${({ $modalSize }) => $modalSize?.height}vh;
    background: #f4e7d8;
    box-shadow: 0 0 0.3rem #000000b2;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2rem;
    gap: 2rem;
    box-sizing: border-box;
`

const SModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    .closeIcon {
        padding: 0.2rem;
        background: #00000011;
        border-radius: 0.5rem;
        transition: all 0.2s;
        cursor: pointer;
        &:hover {
            background: #00000022;
        }
    }
`
