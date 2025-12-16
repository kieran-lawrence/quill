import type { Metadata } from 'next'
import './globals.css'
import { StyledComponentsRegistry } from './registry'

export const metadata: Metadata = {
    title: 'Quill | Where Conversations Flourish',
    description:
        'Quill is a real time chat application that will leave you breathless',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>
                <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
            </body>
        </html>
    )
}
