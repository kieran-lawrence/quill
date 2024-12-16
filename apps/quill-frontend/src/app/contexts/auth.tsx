import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'
import { User } from '@quill/data'
import { useGetAuthStatusQuery } from '../utils/store/auth'

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
    const { refetch } = useGetAuthStatusQuery()
    const { user, updateAuthUser } = useContext(AuthContext)

    useEffect(() => {
        refetch()
            .then(({ data }) => {
                if (data) {
                    updateAuthUser(data)
                }
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
            })
    }, [refetch, updateAuthUser])

    return { user, loading }
}
