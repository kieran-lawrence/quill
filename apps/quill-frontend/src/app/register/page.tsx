'use client'

import styled from 'styled-components'
import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/auth'
import { Header } from '../components/home/Header'
import { QuillButton } from '../components/shared/QuillButton'
import { register } from '../utils/api'

interface RegisterFormProps {
    firstName: string
    lastName: string
    email: string
    username: string
    password: string
}

export default function Register() {
    const { user } = useAuth()
    const { register: formReg, handleSubmit } = useForm<RegisterFormProps>()
    const router = useRouter()

    const onSubmit: SubmitHandler<RegisterFormProps> = (data) => {
        register(data).then(() => {
            router.push('/register/success')
        })
    }

    // Redirect to previous page if already signed in
    if (user) router.back()

    return (
        <SRegisterPage>
            <Header />
            <div className="registrationWrapper">
                <h1>Create your free account</h1>
                <h2>Let your conversations flow</h2>
                <SRegisterForm onSubmit={handleSubmit(onSubmit)}>
                    <SNameInputsWrapper>
                        <SInput
                            id="firstNameInput"
                            type="text"
                            placeholder="First Name"
                            required
                            {...formReg('firstName')}
                            $width="50%"
                        />
                        <SInput
                            id="lastNameInput"
                            type="text"
                            placeholder="Last Name"
                            required
                            {...formReg('lastName')}
                            $width="50%"
                        />
                    </SNameInputsWrapper>
                    <SInput
                        id="usernameInput"
                        type="text"
                        placeholder="Username"
                        required
                        {...formReg('username')}
                    />
                    <SInput
                        id="emailInput"
                        type="email"
                        placeholder="Email"
                        required
                        {...formReg('email')}
                    />
                    <SInput
                        id="passwordInput"
                        type="password"
                        placeholder="Password"
                        required
                        {...formReg('password')}
                    />
                    <QuillButton type="filled" text={'Register'}></QuillButton>
                </SRegisterForm>
                <small>
                    By continuing you agree to our{' '}
                    <Link href="/terms-of-service">Terms of Service</Link> and{' '}
                    <Link href="/privacy-policy">Privacy Policy</Link>
                </small>
                <SDivider />

                <SRegisterCta>
                    Already have an account?
                    <Link href="/login">Login</Link>
                </SRegisterCta>
            </div>
        </SRegisterPage>
    )
}
const SRegisterPage = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 18px;

    .registrationWrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 8px;
        height: 90%;

        h1 {
        }
        h2 {
            font-size: 18px;
            font-weight: 400;
        }
        a {
            font-size: 15px;
        }
    }
`
const SRegisterForm = styled.form`
    width: 25vw;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    box-sizing: border-box;
`
const SInput = styled.input<{ $width?: string }>`
    font-size: 16px;
    border: 1px solid white;
    border-radius: 4px;
    background: #f5f5f5;
    padding: 16px 32px;
    border: 1px solid #ccc;
    outline: none;
    box-sizing: border-box;
    width: ${(props) => props.$width || '100%'};

    &:focus,
    &:active {
        border: 1px solid #e9353b;
    }
`

const SDivider = styled.hr`
    height: 1px;
    width: 12vw;
    background: #adadad;
    border: none;
    margin: 16px 0;
`
const SRegisterCta = styled.div`
    display: flex;
    gap: 8px;
    font-size: 15px;
`
const SError = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    color: #d34e22;
    font-size: 18px;
    font-weight: 400;
`
const SNameInputsWrapper = styled.div`
    display: flex;
    gap: 16px;
`
