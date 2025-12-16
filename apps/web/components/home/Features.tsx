import { Delius } from 'next/font/google'
import Image from 'next/image'
import styled from 'styled-components'

const deliusFont = Delius({
    subsets: ['latin'],
    weight: '400',
})

export const Features = () => {
    return (
        <SFeatureGrid>
            <SFeatureItem>
                <Image
                    src="/showcase/adding-friend.png"
                    className="featuredImage"
                    alt="Adding a friend"
                    width="1300"
                    height="900"
                />
                <h3 className={deliusFont.className}>
                    Connect with your friends or make new ones
                </h3>
            </SFeatureItem>
            <SFeatureItem>
                <Image
                    src="/showcase/editing-message.png"
                    className="featuredImage"
                    alt="Adding a friend"
                    width="1300"
                    height="900"
                />
                <h3 className={deliusFont.className}>Typos? Not a problem!</h3>
            </SFeatureItem>
            <SFeatureItem>
                <Image
                    src="/showcase/updating-group.png"
                    className="featuredImage"
                    alt="Adding a friend"
                    width="1300"
                    height="900"
                />
                <h3 className={deliusFont.className}>
                    Customise your spaces to suit your needs
                </h3>
            </SFeatureItem>
            <SFeatureItem>
                <Image
                    src="/showcase/updating-profile.png"
                    className="featuredImage"
                    alt="Adding a friend"
                    width="1300"
                    height="900"
                />
                <h3 className={deliusFont.className}>
                    Be yourself with full profile customisation
                </h3>
            </SFeatureItem>
        </SFeatureGrid>
    )
}
const SFeatureGrid = styled.div`
    display: grid;
    padding: 2rem 4rem;
    grid-template-columns: 1fr 50px 1fr;
    gap: 2rem;
`
const SFeatureItem = styled.div`
    display: flex;
    flex-direction: column;
    height: 50vh;
    border: 1px solid #9e9e9e;
    border-radius: 0.5rem;
    box-shadow: 0px 0px 5px 1px #9e9e9e6c;

    h3 {
        padding: 1rem;
        font-size: 1.3rem;
    }
    .featuredImage {
        width: 100%;
        height: 100%;
        object-fit: cover;
        flex: 1;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        border-bottom: 1px solid #9e9e9e;
    }

    &:nth-of-type(1) {
        grid-column: 1 / span 2;
    }
    &:nth-of-type(2) {
        grid-column: 3;
    }
    &:nth-of-type(3) {
        grid-column: 1 / 2;
        grid-row: 2;
    }
    &:nth-of-type(4) {
        grid-column: 2 / span 2;
        grid-row: 2;
    }
`
