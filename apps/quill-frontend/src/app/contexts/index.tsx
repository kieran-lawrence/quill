import { Provider } from 'react-redux'
import { store } from '../utils/store'
import { ReactNode } from 'react'
import AuthContextProvider from './auth'
import { ThemeProvider } from 'styled-components'
import { theme } from '../utils/styles/theme'

type Props = { children: ReactNode }
export default function Providers({ children }: Props) {
    return (
        <Provider store={store}>
            <AuthContextProvider>
                <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </AuthContextProvider>
        </Provider>
    )
}
