import styled, { keyframes } from 'styled-components'
import { QuillButton } from '../shared/QuillButton'

export const Hero = () => {
    return (
        <SHero>
            <SHeroText>
                Welcome to a place where conversations flourish
                <p>
                    Join a vibrant community where every message nurtures
                    understanding and sparks collaboration
                </p>
                <QuillButton text="Get Started" type="filled" />
            </SHeroText>

            <SPromoImage
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
                alt="Hero Image"
            />
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
    font-size: 4rem;
    font-weight: 600;
    text-align: center;
    max-width: 50vw;

    p {
        font-size: 1.5rem;
        font-weight: 400;
    }
`
const rotate = keyframes`
  0% {
    //opacity:0;
    transform:scaleX(0);
    //transform: translate3d(0px, 4.8rem, 0px)  rotateX(45deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
  }
  20% {
    //opacity:0;
  }
  100% {
    opacity:1;
    transform:scaleX(1);
    //transform: translate3d(0px, -2.07146rem, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
  }
`
const SPromoImage = styled.img`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70vw;
    height: 50vh;
    border: 1px solid grey;
    animation-name: ${rotate};
    animation-duration: 1000ms;
    animation-direction: alternate;
    animation-timeline: view(y 5% auto);
`
