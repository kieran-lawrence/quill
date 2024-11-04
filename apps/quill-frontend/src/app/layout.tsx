import './global.css'
import { StyledComponentsRegistry } from './registry'

export const metadata = {
    title: 'Quill | Where Conversations Flourish',
    description:
        'Quill is a real time chat application that will leave you breathless',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
            </body>
        </html>
    )
}
