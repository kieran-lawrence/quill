import styled from 'styled-components'
import { QuillLogo } from '../QuillLogo'
import { Dancing_Script } from 'next/font/google'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/auth'
import { QuillButton } from '../shared/QuillButton'

const dancingScript = Dancing_Script({
    subsets: ['latin'],
})
export const Header = () => {
    const { user } = useAuth()
    const router = useRouter()
    const handleClick = () =>
        user ? router.push('/chats') : router.push('/login')

    return (
        <SHeader>
            <STitle href="/">
                <QuillLogo size={64} />
                <h1 className={dancingScript.className}>Quill</h1>
            </STitle>
            <SNav role="navigation">
                <ul>
                    <li>Download</li>
                    <li>Parchment</li>
                    <li>Support</li>
                    <li>Discover</li>
                </ul>
                <QuillButton
                    onClick={handleClick}
                    style="filled"
                    text={user ? 'Open Quill' : 'Get Started'}
                />
            </SNav>
        </SHeader>
    )
}
const SHeader = styled.header`
    display: flex;
    align-items: center;
    width: 80vw;
    padding: 16px 32px;
    gap: 48px;
`
const STitle = styled(Link)`
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: inherit;

    h1 {
        font-size: 62px;
        margin: 0;
    }
`
const SNav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    ul {
        list-style: none;
        display: flex;

        gap: 2rem;
        font-size: 1.2rem;

        li {
            cursor: pointer;
        }
    }
`
