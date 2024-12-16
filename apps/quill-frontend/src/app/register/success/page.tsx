'use client'
import styled from 'styled-components'
import { Header } from '../../components/home/Header'
import { QuillButton } from '../../components/shared/QuillButton'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/auth'
import { Avatar } from '../../components/Avatar'
import { useState } from 'react'
import { GroupUserInitials } from '../../components/GroupUserInitials'
import { usePostUpdateUserMutation } from '../../utils/store/user'
import { useForm } from 'react-hook-form'
import { PiSealWarningBold } from 'react-icons/pi'

interface ProfileProps {
    avatar?: string
}
export default function SuccessPage() {
    const { register, handleSubmit } = useForm<ProfileProps>()

    const [file, setFile] = useState<File>()
    const [imgPath, setImgPath] = useState('')
    const router = useRouter()
    const { user } = useAuth()
    const [postUpdateUser, { error }] = usePostUpdateUserMutation()

    const handleSkip = () => {
        router.push('/chats')
    }
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
    const onSubmit = () => {
        const formData = new FormData()
        if (file) formData.append('avatar', file)
        return postUpdateUser(formData).then(() => handleSkip())
    }

    return (
        <SSuccessPage>
            <Header />
            <h2>Thank you for registering</h2>
            <SProfileForm onSubmit={handleSubmit(onSubmit)}>
                <h3>Finish setting up your profile:</h3>
                {error && (
                    <SError>
                        <PiSealWarningBold color={'#d34e22'} size={24} />
                        {'data' in error
                            ? error.data?.message
                            : 'An unknown error has occurred'}
                    </SError>
                )}
                {imgPath ? (
                    <Avatar imgSrc={imgPath} />
                ) : (
                    user && (
                        <GroupUserInitials
                            text={`${user.firstName} ${user.lastName}`}
                        />
                    )
                )}
                {!imgPath && <p>Upload a profile picture</p>}
                <input
                    type="file"
                    className="fileUploadInput"
                    {...register('avatar', {
                        onChange: (e) => {
                            handleFileUpload(e)
                        },
                    })}
                    accept=".jpg, .jpeg, .png"
                />
                <QuillButton type="filled" text="Save" />
            </SProfileForm>
            <QuillButton type="outlined" text="Skip" onClick={handleSkip} />
        </SSuccessPage>
    )
}

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
    .fileUploadInput {
        outline: none;
    }
    .fileUploadInput::file-selector-button {
        border-radius: 0.5rem;
        padding: 0 1rem;
        height: 2.5rem;
        cursor: pointer;
        background-color: transparent;
        border: 2px solid #f28140;
        outline: none;
        margin-right: 1rem;

        &:is(:hover, :focus, :focus-within) {
            background: #f281403a;
            cursor: pointer;
        }
    }
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
