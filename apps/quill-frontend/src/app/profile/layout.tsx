'use client'
import { ReactNode } from 'react'
import Providers from '../contexts'
import { AuthenticatedRoute } from '../components/AuthenticatedRoute'

type Props = { children: ReactNode }

export default function Layout({ children }: Props) {
    return (
        <Providers>
            <AuthenticatedRoute>{children}</AuthenticatedRoute>
        </Providers>
    )
}
