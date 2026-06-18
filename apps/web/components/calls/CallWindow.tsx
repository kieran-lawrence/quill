import { Chat } from '@repo/api'
import styled from 'styled-components'
import { useAuth } from '../../contexts/auth'
import { getChatRecipient } from '../../utils/helpers'
import { GroupUserInitials } from '../GroupUserInitials'
import { Avatar } from '../Avatar'
import { IoCall, IoVideocam, IoVideocamOff } from 'react-icons/io5'
import { BiSolidMicrophone, BiSolidMicrophoneOff } from 'react-icons/bi'
import { useEffect, useMemo, useRef } from 'react'
import { IconContext } from 'react-icons'
import { useAudioLevelDetector } from '../../utils/hooks/useAudioLevelDetector'
import { useMediaStream } from '../../utils/hooks/useMediaStream'
import { useCall } from '../../contexts/call'

type CallWindowProps = {
    chat: Chat
    onClose: () => void
}

// Group calls not supported yet
export const CallWindow = ({ chat, onClose }: CallWindowProps) => {
    const { user } = useAuth()
    const localVideoRef = useRef<HTMLVideoElement>(null)
    const remoteVideoRef = useRef<HTMLVideoElement>(null)
    const { endCall } = useCall()
    const {
        mediaStream,
        getMediaStream,
        updateMediaStreamMutedState,
        fetchUserDevices,
        devices,
        selectedDevice,
        setSelectedDevice,
        mutedState: { camera: isCameraOff, microphone: isMicrophoneOff },
    } = useMediaStream()
    const isSpeaking = useAudioLevelDetector(mediaStream)
    const { remoteStream, remoteSignal } = useCall()

    useEffect(() => {
        console.log('CallWindow mounted, remoteSignal:', remoteSignal)
    }, [remoteSignal])

    useEffect(() => {
        console.log('CallWindow mounted, remoteStream:', remoteStream)
    }, [remoteStream])

    // This effect sets up media stream and AV devices
    useEffect(() => {
        const handleSetupStream = async () => {
            await fetchUserDevices()
            await getMediaStream()
        }
        handleSetupStream()
    }, [fetchUserDevices, getMediaStream])

    const videoDevices = useMemo(() => {
        return devices.filter((device) => device.kind === 'videoinput')
    }, [devices])

    const audioDevices = useMemo(() => {
        return devices.filter((device) => device.kind === 'audioinput')
    }, [devices])

    useEffect(() => {
        console.log('isSpeaking changed: ', isSpeaking)
    }, [isSpeaking])

    useEffect(() => {
        if (localVideoRef.current && mediaStream) {
            localVideoRef.current.srcObject = mediaStream
        }
    }, [mediaStream, localVideoRef])
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream
        }
    }, [remoteStream, remoteVideoRef])

    return (
        <SCallWrapper>
            <SCallContainer>
                <SCallUserContainer>
                    {`Call with ${getChatRecipient(chat, user).firstName} ${getChatRecipient(chat, user).lastName}`}{' '}
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        style={{
                            width: '40%',
                            borderRadius: 8,
                            background: '#222',
                            display: 'flex',
                        }}
                    />
                </SCallUserContainer>
                <SCallSelfContainer $isSpeaking={isSpeaking}>
                    <SVideoSelfView
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        $isVisible={!isCameraOff}
                    />
                    {isCameraOff ? (
                        user && user.avatar ? (
                            <Avatar
                                imgSrc={`/images/${user.avatar}`}
                                size="10rem"
                            />
                        ) : (
                            <GroupUserInitials
                                text={`${user?.firstName} ${user?.lastName}`}
                                size="10rem"
                            />
                        )
                    ) : null}
                </SCallSelfContainer>
                <SCallOptions>
                    <IconContext.Provider
                        value={{
                            className: 'optionIcons',
                            size: '1.5rem',
                            color: '#e1e1e1',
                        }}
                    >
                        <SOptionButton
                            onClick={() => {
                                updateMediaStreamMutedState({
                                    camera: isCameraOff,
                                    microphone: !isMicrophoneOff,
                                })
                            }}
                        >
                            Mic{' '}
                            {isMicrophoneOff ? (
                                <BiSolidMicrophoneOff />
                            ) : (
                                <BiSolidMicrophone />
                            )}
                        </SOptionButton>
                        <SOptionButton
                            onClick={() => {
                                updateMediaStreamMutedState({
                                    camera: !isCameraOff,
                                    microphone: isMicrophoneOff,
                                })
                            }}
                        >
                            Camera{' '}
                            {isCameraOff ? <IoVideocamOff /> : <IoVideocam />}
                        </SOptionButton>
                        <SDeviceSelectionOptions>
                            <SDeviceOptionFieldset>
                                <SDeviceOptionLabel>
                                    Select a camera:
                                </SDeviceOptionLabel>
                                <SDeviceOptionSelect
                                    onChange={(e) =>
                                        setSelectedDevice({
                                            ...selectedDevice,
                                            ['videoinput']: videoDevices.find(
                                                (device) =>
                                                    device.deviceId ===
                                                    e.target.value,
                                            )!,
                                        })
                                    }
                                >
                                    {videoDevices.map((device) => (
                                        <option
                                            className="bg-neutral-800 text-white"
                                            key={device.deviceId}
                                            value={device.deviceId}
                                        >
                                            {device.label}
                                        </option>
                                    ))}
                                </SDeviceOptionSelect>
                            </SDeviceOptionFieldset>
                            <SDeviceOptionFieldset>
                                <SDeviceOptionLabel>
                                    Select a microphone:
                                </SDeviceOptionLabel>
                                <SDeviceOptionSelect
                                    onChange={(e) =>
                                        setSelectedDevice({
                                            ...selectedDevice,
                                            ['audioinput']: audioDevices.find(
                                                (device) =>
                                                    device.deviceId ===
                                                    e.target.value,
                                            )!,
                                        })
                                    }
                                >
                                    {audioDevices.map((device) => (
                                        <option
                                            key={device.deviceId}
                                            value={device.deviceId}
                                        >
                                            {device.label}
                                        </option>
                                    ))}
                                </SDeviceOptionSelect>
                            </SDeviceOptionFieldset>
                        </SDeviceSelectionOptions>
                        <SLeaveCallButton
                            onClick={() => {
                                endCall()
                                onClose()
                            }}
                        >
                            Leave
                            <IoCall />
                        </SLeaveCallButton>
                    </IconContext.Provider>
                </SCallOptions>
            </SCallContainer>
        </SCallWrapper>
    )
}

const SCallWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    inset: 0;
    z-index: 10;
    background: #000000d4;
`
// Fills available space in call window, used to anchor all sub components
const SCallContainer = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    position: relative;
`
// Centered container for call user info
const SCallUserContainer = styled.div`
    display: flex;
    width: 90%;
    height: 90%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    background: ${({ theme }) => theme.colors.blueAccent};
    border-radius: 1rem;
`
const SCallSelfContainer = styled.div<{ $isSpeaking: boolean }>`
    display: flex;
    width: fit-content;
    height: 10rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    border: ${({ $isSpeaking }) =>
        $isSpeaking ? '3px solid #3fab43b0' : '3px solid #ffffff0'};

    border-radius: 0.6rem;
`
const SVideoSelfView = styled.video<{ $isVisible: boolean }>`
    flex: 1;
    height: 100%;
    border-radius: 0.5rem;
    background: #222;
    display: ${({ $isVisible }) => ($isVisible ? 'flex' : 'none')};
`
// Positioned at bottom center of call window
const SCallOptions = styled.div`
    display: grid;
    grid-template-columns: 5rem 5rem 7rem;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    position: absolute;
    bottom: 2rem;
    left: auto;
    right: auto;
    background: #414344;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px #000000a8;

    .optionIcons {
        cursor: pointer;
        color: ${({ theme }) => theme.colors.text.weak};
        transition: color 0.2s;
        &:hover {
            color: ${({ theme }) => theme.colors.blueStrong};
        }
    }
`
const SLeaveCallButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    color: #e1e1e1;
    border-radius: 0.5rem;
    outline: none;
    border: none;
    background: #844040;
`
const SOptionButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    color: #e1e1e1;
    border-radius: 0.5rem;
    outline: none;
    border: none;
    background: none;
`
const SDeviceSelectionOptions = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    grid-row: 2 / span 1;
    grid-column: 1 / span 3;
`
const SDeviceOptionFieldset = styled.fieldset`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    border: none;
`
const SDeviceOptionLabel = styled.label`
    color: #ffffff;
    font-size: 1rem;
    width: 50%;
`
const SDeviceOptionSelect = styled.select`
    width: 50%;
    padding: 0.5rem 1rem;
    max-width: 15ch;
    background: #2c2c2c;
    color: #ffffff;
    outline: none;
`
