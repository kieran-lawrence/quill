import styled from 'styled-components'

export const Features = () => {
    return (
        <SFeatureGrid>
            <SFeatureItem>
                <div className="featuredImage" />
                <h3>Feature 1</h3>
            </SFeatureItem>
            <SFeatureItem>
                <div className="featuredImage" />
                <h3>Feature 2</h3>
            </SFeatureItem>
            <SFeatureItem>
                <div className="featuredImage" />
                <h3>Feature 3</h3>
            </SFeatureItem>
            <SFeatureItem>
                <div className="featuredImage" />
                <h3>Feature 4</h3>
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
    }
    .featuredImage {
        flex: 1;
        background: url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80');
        background-size: cover;
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
