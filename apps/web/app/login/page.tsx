'use client'
import styled from 'styled-components'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Header } from '../../components/home/Header'
import { QuillButton } from '../../components/shared/QuillButton'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login } from '../../utils/api'
import toast, { Toaster } from 'react-hot-toast'

type LoginFormProps = {
    email: string
    password: string
}

export default function LoginPage() {
    const { register, handleSubmit } = useForm<LoginFormProps>()
    const router = useRouter()

    const onSubmit: SubmitHandler<LoginFormProps> = (data) => {
        login(data).then(async (success) => {
            success
                ? router.push('/chats')
                : toast.error('Login Failed. Please try again.')
        })
    }

    return (
        <SLoginPage>
            <Toaster />
            <Header />
            <div className="loginWrapper">
                <h2>Login</h2>
                <h3>Join the conversation.</h3>
                <SLoginForm onSubmit={handleSubmit(onSubmit)}>
                    <SInput
                        id="emailInput"
                        type="email"
                        placeholder="Email"
                        required
                        {...register('email')}
                    />
                    <SInput
                        id="passwordInput"
                        type="password"
                        placeholder="Password"
                        required
                        {...register('password')}
                    />
                    <Link href="/forgot-password">Forgot your password?</Link>
                    <QuillButton
                        text={'Log In'}
                        style="filled"
                        isDisabled={false}
                    />
                </SLoginForm>
                <SDivider />
                <SRegisterCta>
                    Don&apos;t have an account?
                    <Link href="/register">Register now</Link>
                </SRegisterCta>
            </div>
        </SLoginPage>
    )
}
const SLoginPage = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 1.1rem;

    .loginWrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        height: 90%;

        h2 {
            font-size: 1.8rem;
        }
        h3 {
            font-size: 1.1rem;
            font-weight: 400;
        }
        a {
            font-size: 1rem;
        }
    }
`
const SLoginForm = styled.form`
    width: 20vw;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    box-sizing: border-box;
`
const SInput = styled.input`
    font-size: 1rem;
    border: 1px solid white;
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    padding: 1rem 2rem;
    border: ${({ theme }) => `1px solid ${theme.colors.text.accent}`};
    outline: none;
    box-sizing: border-box;

    &:focus,
    &:active {
        border: ${({ theme }) => `1px solid ${theme.colors.blueStrong}`};
    }
`

const SDivider = styled.hr`
    height: 1px;
    width: 12vw;
    background: ${({ theme }) => theme.colors.text.accent};
    border: none;
    margin: 1rem 0;
`
const SRegisterCta = styled.div`
    display: flex;
    gap: 0.5rem;
    font-size: 0.9rem;
`
