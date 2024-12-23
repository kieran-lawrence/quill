'use client'
import styled from 'styled-components'
import { Header } from '../components/home/Header'
import { QuillButton } from '../components/shared/QuillButton'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/auth'
import { Avatar } from '../components/Avatar'
import { useState } from 'react'
import { GroupUserInitials } from '../components/GroupUserInitials'
import { SubmitHandler, useForm, UseFormRegister } from 'react-hook-form'
import { updateUser } from '../utils/api'
import toast, { Toaster } from 'react-hot-toast'
import { PiPencilSimpleBold } from 'react-icons/pi'
import { useWebSocketEvents } from '../utils/hooks'

type ProfileFormProps = {
    firstName?: string
    lastName?: string
    username?: string
    avatar?: string
}
export default function ProfilePage() {
    const { register, handleSubmit, reset, watch } = useForm<ProfileFormProps>()
    const { sendMessage } = useWebSocketEvents()
    const [file, setFile] = useState<File>()
    const [imgPath, setImgPath] = useState('')
    const router = useRouter()
    const { user } = useAuth()

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target
        if (files && files.length) {
            const uploadedFile = files.item(0)
            if (uploadedFile) {
                setImgPath(URL.createObjectURL(uploadedFile))
                setFile(uploadedFile)
            }
        }
    }

    const onCancel = () => {
        reset()
        setImgPath('')
        setFile(undefined)
    }

    const onSubmit: SubmitHandler<ProfileFormProps> = ({
        firstName,
        lastName,
        username,
    }) => {
        const formData = new FormData()
        if (file) formData.append('avatar', file)
        if (firstName) formData.append('firstName', firstName)
        if (lastName) formData.append('lastName', lastName)
        if (username) formData.append('username', username)

        updateUser(formData).then((resp) => {
            if ('status' in resp) {
                const errorMessage = resp?.message
                toast.error(
                    errorMessage || 'An error occurred updating your profile.',
                )
            } else {
                sendMessage('onUserUpdated', {
                    updatedUser: resp,
                })
                router.push('/chats')
            }
        })
    }

    return (
        <SSuccessPage>
            <Header />
            <Toaster />
            <h2>Profile</h2>
            <SProfileForm onSubmit={handleSubmit(onSubmit)}>
                <SUserContent>
                    <SInputsWrapper>
                        <FormField
                            labelText="First Name"
                            placeholder="eg. John"
                            register={register}
                            registerField="firstName"
                        />
                        <FormField
                            labelText="Last Name"
                            placeholder="eg. Smith"
                            register={register}
                            registerField="lastName"
                        />
                        <FormField
                            labelText="Username"
                            placeholder="eg. JohnSmith123"
                            register={register}
                            registerField="username"
                        />
                    </SInputsWrapper>
                    <SProfilePreview>
                        <span className="name">{`${
                            watch('firstName') || user?.firstName
                        } ${watch('lastName') || user?.lastName}`}</span>
                        <span className="username">
                            {watch('username') || user?.username}
                        </span>
                        <SAvatarInput
                            onClick={() => {
                                document
                                    .getElementById('fileUploadInput')
                                    ?.click()
                            }}
                        >
                            <EditIconWrapper>
                                <PiPencilSimpleBold />
                            </EditIconWrapper>
                            {imgPath ? (
                                <Avatar imgSrc={imgPath} />
                            ) : user?.avatar ? (
                                <Avatar imgSrc={`/images/${user.avatar}`} />
                            ) : (
                                <GroupUserInitials
                                    text={`${user?.firstName} ${user?.lastName}`}
                                />
                            )}
                            <input
                                type="file"
                                id="fileUploadInput"
                                {...register('avatar', {
                                    onChange: (e) => {
                                        handleFileUpload(e)
                                    },
                                })}
                                accept=".jpg, .jpeg, .png"
                            />
                        </SAvatarInput>
                    </SProfilePreview>
                </SUserContent>
                <QuillButton style="filled" text="Save" />
                <QuillButton
                    style="outlined"
                    text="Cancel"
                    type="button"
                    onClick={onCancel}
                />
            </SProfileForm>
        </SSuccessPage>
    )
}
type FormFieldProps = {
    labelText: string
    placeholder: string
    inputType?: React.InputHTMLAttributes<HTMLInputElement>['type']
    register: UseFormRegister<ProfileFormProps>
    registerField: keyof ProfileFormProps
}
const FormField = ({
    labelText,
    placeholder,
    inputType = 'text',
    register,
    registerField,
}: FormFieldProps) => {
    return (
        <SFormFieldWrapper>
            <label htmlFor={registerField}>{labelText}</label>
            <input
                type={inputType}
                id={registerField}
                placeholder={placeholder}
                {...register(registerField)}
            />
        </SFormFieldWrapper>
    )
}
const SFormFieldWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
    transition: all 0.2s;

    input {
        border: none;
        background: ${({ theme }) => theme.colors.blueAccent};
        outline: ${({ theme }) => `1px solid ${theme.colors.blueAccent}`};
        color: ${({ theme }) => theme.colors.text.primary};
        font-size: 1.1rem;
        width: 100%;
        box-sizing: border-box;
        border-radius: 0.5rem;
        padding: 0.5rem;

        &:is(:hover, :active, :focus) {
            outline: ${({ theme }) => `1px solid ${theme.colors.blueStrong}`};
        }
    }
`
const SSuccessPage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    h2 {
        font-size: 2rem;
        padding: 1rem;
    }
    button {
        width: 30%;
    }
`
const SUserContent = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 1rem;
    width: 100%;
`
const SProfileForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    width: 30%;
    h3 {
        padding-bottom: 1rem;
    }
    button {
        width: 100%;
    }
    #fileUploadInput {
        display: none;
    }
`
const SInputsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 50%;
`
const EditIconWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.colors.text.weak};
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
`
const SProfilePreview = styled.address`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 100%;
    gap: 0.5rem;
    font-style: normal;
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.colors.blueWeak};
    padding: 1rem;
    box-sizing: border-box;

    .name {
        font-size: 1.3rem;
    }
    .username {
        font-size: 1rem;
        color: ${({ theme }) => theme.colors.text.accent};
        font-style: italic;
    }
`
const SAvatarInput = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;

    &:hover {
        cursor: pointer;
    }
    &:hover ${EditIconWrapper} {
        color: ${({ theme }) => theme.colors.text.light};
        font-size: 1.5rem;
        opacity: 1;
    }
`
