import { useCallback, useEffect, useRef, useState } from 'react'
import { checkAudioLevel } from '../helpers'

/** Custom hook to detect audio levels in a media stream */
export const useAudioLevelDetector = (
    mediaStream: MediaStream | null,
): boolean => {
    const [isExceedingThreshold, setIsExceedingThreshold] = useState(false)
    const audioContextRef = useRef<AudioContext | null>(null)
    const analyserRef = useRef<AnalyserNode | null>(null)
    const timeoutIdRef = useRef<number | null>(null)

    const SOUND_THRESHOLD = 0.1
    const LISTEN_INTERVAL = 200

    // Function to be called at each interval to check audio levels
    const onInterval = useCallback(() => {
        if (!analyserRef.current) return
        checkAudioLevel({
            threshold: SOUND_THRESHOLD,
            analyser: analyserRef.current!,
            onExceedThreshold: () => {
                setIsExceedingThreshold(true)
            },
            onBelowThreshold: () => {
                setIsExceedingThreshold(false)
            },
        })
    }, [SOUND_THRESHOLD])

    // Clean up function to stop the audio context and clear the interval
    const onCleanUp = useCallback(() => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current)
        }
        if (
            audioContextRef.current &&
            audioContextRef.current.state !== 'closed'
        ) {
            // Close the audio context if it is not closed
            audioContextRef.current.close()
        }
        audioContextRef.current = null
        analyserRef.current = null
    }, [])

    // Set up the audio context and analyser when mediaStream changes
    useEffect(() => {
        if (!mediaStream || !mediaStream.getAudioTracks().length) {
            setIsExceedingThreshold(false)
            return
        }

        if (!audioContextRef.current) {
            audioContextRef.current =
                new // This is required as some browsers (Safari) use webkitAudioContext which typescript does not recognise
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (window.AudioContext || (window as any).webkitAudioContext)()
        }

        if (!analyserRef.current) {
            analyserRef.current = audioContextRef.current.createAnalyser() // Create an AnalyserNode
        }

        const source =
            audioContextRef.current.createMediaStreamSource(mediaStream)
        source.connect(analyserRef.current)

        timeoutIdRef.current = window.setInterval(onInterval, LISTEN_INTERVAL)
        onInterval()

        return () => {
            onCleanUp()
        }
    }, [mediaStream, SOUND_THRESHOLD, LISTEN_INTERVAL, onInterval, onCleanUp])

    return isExceedingThreshold
}
