'use client'
import { ReactNode } from 'react'
import Providers from '../contexts'

type Props = { children: ReactNode }

export default function Layout({ children }: Props) {
    return <Providers>{children}</Providers>
}
