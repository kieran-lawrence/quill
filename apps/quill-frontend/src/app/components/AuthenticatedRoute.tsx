'use client'

import { FC } from 'react'
import Link from 'next/link'
import { useAuth } from '../contexts/auth'
import styled from 'styled-components'
import { LoadingSpinner } from './LoadingSpinner'
import { useRouter } from 'next/navigation'
export const AuthenticatedRoute: FC<React.PropsWithChildren> = ({
    children,
}) => {
    const { user, loading } = useAuth()
    const router = useRouter()

    if (loading)
        return (
            <SLoadingContainer>
                <LoadingSpinner />
            </SLoadingContainer>
        )
    if (user) return <>{children}</>

    router.replace('/login')
    return null
}
const SLoadingContainer = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    width: 100vw;
    background: #00000032;
`
