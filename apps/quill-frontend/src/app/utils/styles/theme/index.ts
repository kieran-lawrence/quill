export const theme = {
    colors: {
        blueStrong: '#7678ED',
        blueAccent: '#DBDCFC',
        blueWeak: '#EEEEf7',
        orangeStrong: '#FF7A55',
        backgroundPrimary: '#F9FAFC',
        backgroundSecondary: '#EDEDED',
        dark: '#202022',
        text: {
            primary: '#1E1E1E',
            accent: '#494A84',
            light: '#F6F6F6',
            weak: '#1C1C1C8D',
        },
        shadow: '#00000020',
        userStatus: {
            online: '#28C469',
            away: '#EBA604',
            busy: '#E74C3C',
            offline: {
                background: 'transparent',
                border: '#859293',
            },
        },
    },
} as const

export type Theme = typeof theme
