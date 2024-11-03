import { Chat } from './entities/Chat'
import { Friend } from './entities/Friend'
import { GroupChat } from './entities/GroupChat'
import { GroupMessage } from './entities/GroupMessage'
import { PrivateMessage } from './entities/PrivateMessage'
import { Session } from './entities/Session'
import { User } from './entities/User'

const entities = [
    User,
    Friend,
    Chat,
    PrivateMessage,
    GroupChat,
    GroupMessage,
    Session,
]

export { User, Friend, Chat, PrivateMessage, GroupChat, GroupMessage, Session }
export default entities
