import { Chat } from './entities/Chat'
import { PrivateMessage } from './entities/PrivateMessage'
import { Session } from './entities/Session'
import { User } from './entities/User'

const entities = [User, Chat, PrivateMessage, Session]

export { User, Chat, PrivateMessage, Session }
export default entities
