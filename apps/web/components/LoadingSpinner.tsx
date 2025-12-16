import styled from 'styled-components'

export const LoadingSpinner = () => {
    return (
        <SLoadingSpinner
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle className="dot" cx="4" cy="12" r="3" />
            <circle className="dot dotTwo" cx="12" cy="12" r="3" />
            <circle className="dot dotThree" cx="20" cy="12" r="3" />
        </SLoadingSpinner>
    )
}
const SLoadingSpinner = styled.svg`
    .dot {
        animation: spinner_8HQG 1.05s infinite;
    }
    .dotTwo {
        animation-delay: 0.1s;
    }
    .dotThree {
        animation-delay: 0.2s;
    }

    @keyframes spinner_8HQG {
        0%,
        57.14% {
            animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
            transform: translate(0);
        }
        28.57% {
            animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
            transform: translateY(-6px);
        }
        100% {
            transform: translate(0);
        }
    }
`
