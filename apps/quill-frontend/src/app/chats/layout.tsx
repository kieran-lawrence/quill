'use client'
import { ReactNode } from 'react'
import Providers from '../contexts'
import styled from 'styled-components'
import { Sidebar } from '../components/chats/Sidebar'
import { AuthenticatedRoute } from '../components/AuthenticatedRoute'

type Props = { children: ReactNode }

export default function Layout({ children }: Props) {
    return (
        <Providers>
            <AuthenticatedRoute>
                <SChatsBackground>
                    <Sidebar />
                    {children}
                </SChatsBackground>
            </AuthenticatedRoute>
        </Providers>
    )
}
const SChatsBackground = styled.div`
    display: flex;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: #1e1e1e;
    padding: 0.4rem 1rem;
    gap: 1rem;
    box-sizing: border-box;
`
