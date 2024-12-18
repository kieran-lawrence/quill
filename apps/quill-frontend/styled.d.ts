import 'styled-components'
import { Theme } from './src/app/utils/styles/theme'

declare module 'styled-components' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
    export interface DefaultTheme extends Theme {}
}
