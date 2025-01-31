import styled from 'styled-components'
import { QuillButton } from '../shared/QuillButton'
import { useAuth } from '../../contexts/auth'
import { Delius } from 'next/font/google'

const deliusFont = Delius({
    subsets: ['latin'],
    weight: '400',
})

export const Hero = () => {
    const { user } = useAuth()
    return (
        <SHero>
            <SHeroText className={deliusFont.className}>
                Welcome to a place where conversations flourish
                <p>
                    Join a vibrant community where every message nurtures
                    understanding and sparks collaboration
                </p>
                {!user && <QuillButton text="Register Now" style="filled" />}
            </SHeroText>

            <SPromoImage src="/hero-image.png" alt="Hero Image" />
        </SHero>
    )
}
const SHero = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    justify-content: space-between;
    gap: 2rem;
    padding: 4rem 0;
    overflow: clip;
`
const SHeroText = styled.h2`
    font-size: 3.5rem;
    font-weight: 700;
    text-align: center;
    max-width: 50vw;

    p {
        font-size: 1.5rem;
        font-weight: 400;
        font-family: initial;
        letter-spacing: 0;
    }
`
const SPromoImage = styled.img`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70vw;
    height: auto;
    border-radius: 0.5rem;
    border: 1px solid grey;
`
