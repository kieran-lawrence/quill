import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'
import { User } from '@quill/data'
import { authStatus } from '../utils/api'

type AuthUser = Partial<User>
type AuthContextType = {
    user?: AuthUser
    updateAuthUser: (user: AuthUser) => void
}

export const AuthContext = createContext<AuthContextType>({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    updateAuthUser: () => {},
})

type Props = { children: ReactNode }
export default function AuthContextProvider({ children }: Props) {
    const [user, setUser] = useState<AuthUser>()
    return (
        <AuthContext.Provider value={{ user, updateAuthUser: setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const [loading, setLoading] = useState(true)
    const { user, updateAuthUser } = useContext(AuthContext)

    useEffect(() => {
        authStatus().then((res) => {
            if ('status' in res) {
                return
            } else {
                updateAuthUser(res)
            }
            setLoading(false)
        })
    }, [updateAuthUser])

    return { user, loading }
}
