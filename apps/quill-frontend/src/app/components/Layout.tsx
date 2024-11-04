import { ReactNode } from 'react'
import styled from 'styled-components'

type Props = { children: ReactNode }

export default function Layout({ children }: Props) {
    return (
        <SPage>
            <main>{children}</main>
        </SPage>
    )
}

const SPage = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`
