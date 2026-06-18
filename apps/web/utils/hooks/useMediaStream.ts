import { useCallback, useEffect, useState } from 'react'

interface MutedState {
    microphone: boolean
    camera: boolean
}

type SelectedMediaDevice = Partial<Record<MediaDeviceKind, MediaDeviceInfo>>

/** Custom hook to manage media stream */
export const useMediaStream = (
    initialConstraints: MediaStreamConstraints = { audio: true, video: true },
) => {
    const [hasAuthorised, setHasAuthorised] = useState<boolean>(false)
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [selectedDevice, setSelectedDevice] = useState<SelectedMediaDevice>(
        {},
    )

    const [error, setError] = useState<Error | null>(null)
    const [mutedState, setMutedState] = useState<MutedState>({
        microphone: !initialConstraints.audio,
        camera: !initialConstraints.video,
    })

    // Gets media stream constraints based on selected devices
    const getConstraints = useCallback(() => {
        const constraints: MediaStreamConstraints = { audio: true, video: true }
        if (selectedDevice.audioinput) {
            constraints.audio = { deviceId: selectedDevice.audioinput.deviceId }
        }
        if (selectedDevice.videoinput) {
            constraints.video = { deviceId: selectedDevice.videoinput.deviceId }
        }

        return constraints
    }, [selectedDevice])

    // Gets the media stream
    const getMediaStream = useCallback(async () => {
        if (stream) {
            // Stop all tracks in the current stream
            stream.getTracks().forEach((track) => track.stop())
        }
        try {
            const userStream =
                await navigator.mediaDevices.getUserMedia(getConstraints())
            setStream(userStream)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err
                    : new Error('An unknown error occurred'),
            )
        }

        // This is required bcause getMediaStream should not be re-created when `stream` changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getConstraints])

    const updateMediaStreamMutedState = async (newMutedState: MutedState) => {
        let needNewStream = false

        try {
            // We dont need a new stream if the camera or microphone is being muted
            if (
                newMutedState.camera !== mutedState.camera &&
                newMutedState.camera === false
            ) {
                needNewStream = true
            }

            if (!needNewStream) {
                stream
                    ?.getAudioTracks()
                    .forEach(
                        (track) => (track.enabled = !newMutedState.microphone),
                    )
                stream
                    ?.getVideoTracks()
                    .forEach((track) => (track.enabled = !newMutedState.camera))
                setMutedState(newMutedState)
            } else {
                if (stream) {
                    stream.getTracks().forEach((track) => track.stop())
                }

                const newStream =
                    await navigator.mediaDevices.getUserMedia(getConstraints())
                if (newMutedState.camera) {
                    newStream
                        .getVideoTracks()
                        .forEach(
                            (track) => (track.enabled = !newMutedState.camera),
                        )
                }
                if (newMutedState.microphone) {
                    newStream
                        .getAudioTracks()
                        .forEach(
                            (track) =>
                                (track.enabled = !newMutedState.microphone),
                        )
                }

                setStream(newStream)
                setMutedState(newMutedState)
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err
                    : new Error('Failed to update media stream'),
            )
        }
    }

    const fetchUserDevices = useCallback(async () => {
        try {
            // Request permissions to access media devices
            const permissions = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            })
            // Stop all tracks to release the devices
            permissions.getTracks().forEach((track) => track.stop())

            // Request the list of media devices from the browser
            const devices = await navigator.mediaDevices.enumerateDevices()
            setDevices(devices)
            setHasAuthorised(true)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err
                    : new Error('Failed to enumerate devices'),
            )
            setHasAuthorised(false)
        }
    }, [])

    useEffect(() => {
        if (!hasAuthorised) return

        getMediaStream()
    }, [selectedDevice, getMediaStream, hasAuthorised])

    return {
        mediaStream: stream,
        error,
        getMediaStream,
        updateMediaStreamMutedState,
        mutedState,
        fetchUserDevices,
        devices,
        selectedDevice,
        setSelectedDevice,
    }
}
