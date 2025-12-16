import 'styled-components'
import { Theme } from './utils/styles/theme'

declare module 'styled-components' {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface DefaultTheme extends Theme {}
}
