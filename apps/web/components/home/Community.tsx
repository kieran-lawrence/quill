import styled from 'styled-components'
import { QuillButton } from '../shared/QuillButton'
import Image from 'next/image'
import { Delius } from 'next/font/google'

const deliusFont = Delius({
    subsets: ['latin'],
    weight: '400',
})

export const Community = () => {
    return (
        <SCommunity>
            <div className="innerLeft">
                <h3 className={deliusFont.className}>
                    🌟 Join the Conversation with Quill! ✍️
                </h3>
                <p className={deliusFont.className}>
                    Unlock a world of connection and creativity. Sign up now to
                    start chatting, sharing, and collaborating with friends and
                    colleagues. Don’t miss out—your next great conversation is
                    just a click away!
                </p>
                <QuillButton text="Sign Up" style="filled" />
            </div>
            <Image
                className="innerRight"
                src="/showcase/chat-overview.png"
                width="1280"
                height="800"
                alt="Chats Overview"
            />
        </SCommunity>
    )
}
const SCommunity = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 4rem;
    .innerLeft {
        h3 {
            padding: 1rem 0;
            font-size: 2rem;
            font-weight: 500;
        }
        p {
            font-size: 1.3rem;
            font-weight: 400;
        }
        width: 30%;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        gap: 2rem;
    }
    .innerRight {
        width: 60%;
        height: auto;
        object-fit: contain;
        border-radius: 0.5rem;
    }
`
