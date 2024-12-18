'use client'

import { ReactNode } from 'react'
import Providers from '../contexts'
import styled from 'styled-components'
import { Sidebar } from '../components/chats/Sidebar'
import { AuthenticatedRoute } from '../components/AuthenticatedRoute'
import { AvailableChats } from '../components/chats/AvailableChats'
import { Poppins } from 'next/font/google'

type Props = { children: ReactNode }

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
})

export default function Layout({ children }: Props) {
    return (
        <Providers>
            <AuthenticatedRoute>
                <SChatsBackground className={poppins.className}>
                    <Sidebar />
                    <AvailableChats />
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
    background: ${({ theme }) => theme.colors.dark};
    padding: 0.4rem 1rem;
    box-sizing: border-box;
`
