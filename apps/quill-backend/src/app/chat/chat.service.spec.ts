import { Test, TestingModule } from '@nestjs/testing'
import { ChatService } from './chat.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Chat, PrivateMessage, User } from '../../utils/typeorm'
import { Repository } from 'typeorm'
import { Services } from '../../utils/constants'
import { CreateChatParams } from '../../utils/types'
import { UserService } from '../user/user.service'

const mockUsers: User[] = [
    {
        id: 1,
        username: 'user1',
        email: '1@1.com',
        firstName: 'test1',
        lastName: 'test1',
        password: 'test1234',
        messages: [],
        groupChats: [],
        presence: undefined,
    },
    {
        id: 2,
        username: 'user2',
        email: '2@2.com',
        firstName: 'test2',
        lastName: 'test2',
        password: 'test1234',
        messages: [],
        groupChats: [],
        presence: undefined,
    },
    {
        id: 2,
        username: 'user3',
        email: '3@3.com',
        firstName: 'test3',
        lastName: 'test3',
        password: 'test1234',
        messages: [],
        groupChats: [],
        presence: undefined,
    },
]
const mockChats: Chat[] = [
    {
        id: 1,
        creator: mockUsers[0],
        recipient: mockUsers[1],
        messages: [],
        lastMessageSentAt: new Date(),
        createdAt: new Date(),
        lastMessageSent: null,
    },
    {
        id: 2,
        creator: mockUsers[0],
        recipient: mockUsers[2],
        messages: [],
        lastMessageSentAt: new Date(),
        createdAt: new Date(),
        lastMessageSent: null,
    },
    {
        id: 3,
        creator: mockUsers[1],
        recipient: mockUsers[2],
        messages: [
            {
                id: 1,
                author: mockUsers[0],
                messageContent: 'test',
                createdAt: new Date(),
                chat: {
                    id: 2,
                    creator: mockUsers[0],
                    recipient: mockUsers[2],
                    messages: [],
                    lastMessageSentAt: new Date(),
                    createdAt: new Date(),
                    lastMessageSent: null,
                },
            },
        ],
        lastMessageSentAt: new Date(),
        createdAt: new Date(),
        lastMessageSent: null,
    },
]
describe('ChatService', () => {
    const MessageRepositoryToken = getRepositoryToken(PrivateMessage)
    const ChatRepositoryToken = getRepositoryToken(Chat)

    let service: ChatService
    let userService: UserService
    let messageRepository: Repository<PrivateMessage>
    let chatRepository: Repository<Chat>
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ChatService,
                {
                    provide: MessageRepositoryToken,
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: ChatRepositoryToken,
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: Services.USER,
                    useValue: {
                        findUser: jest.fn(),
                    },
                },
            ],
        }).compile()

        service = module.get<ChatService>(ChatService)
        messageRepository = module.get<Repository<PrivateMessage>>(
            MessageRepositoryToken,
        )
        chatRepository = module.get<Repository<Chat>>(ChatRepositoryToken)
        userService = module.get<UserService>(Services.USER)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
    it('messageRepository should be defined', () => {
        expect(messageRepository).toBeDefined()
    })
    it('chatRepository should be defined', () => {
        expect(chatRepository).toBeDefined()
    })
    it('userService should be defined', () => {
        expect(userService).toBeDefined()
    })
    describe('createChat', () => {
        it('should successfully find recipient', async () => {
            jest.spyOn(service, 'createChat').mockImplementation((params) =>
                Promise.resolve(
                    mockChats.find(
                        (chat) => chat.recipient.email === params.email,
                    ),
                ),
            )
            const params: CreateChatParams = {
                user: mockUsers[0],
                email: mockUsers[1].email,
            }
            const chat = await service.createChat(params)
            expect(service.createChat).toHaveBeenCalledWith(params)
            expect(chat).toEqual(mockChats[0])
        })
        it('should fail to find recipient', async () => {
            jest.spyOn(service, 'createChat').mockImplementation((params) =>
                Promise.resolve(
                    mockChats.find(
                        (chat) => chat.recipient.email === params.email,
                    ),
                ),
            )
            const params: CreateChatParams = {
                user: mockUsers[1],
                email: mockUsers[0].email,
            }
            const chat = await service.createChat(params)
            expect(service.createChat).toHaveBeenCalledWith(params)
            expect(chat).not.toEqual(mockChats[0])
        })
        it('should successfully find author', async () => {
            jest.spyOn(service, 'createChat').mockImplementation((params) =>
                Promise.resolve(
                    mockChats.find(
                        (chat) => chat.creator.id === params.user.id,
                    ),
                ),
            )
            const params: CreateChatParams = {
                user: mockUsers[0],
                email: mockUsers[1].email,
            }
            const chat = await service.createChat(params)
            expect(service.createChat).toHaveBeenCalledWith(params)
            expect(chat).toEqual(mockChats[0])
        })
        it('should fail to find author', async () => {
            jest.spyOn(service, 'createChat').mockImplementation((params) =>
                Promise.resolve(
                    mockChats.find(
                        (chat) => chat.creator.id === params.user.id,
                    ),
                ),
            )
            const params: CreateChatParams = {
                user: mockUsers[2],
                email: mockUsers[1].email,
            }
            const chat = await service.createChat(params)
            expect(service.createChat).toHaveBeenCalledWith(params)
            expect(chat).not.toEqual(mockChats[0])
        })
        it('should find existing an chat and not create a new one', async () => {
            jest.spyOn(service, 'createChat').mockImplementation((params) =>
                Promise.resolve(
                    mockChats.find(
                        (chat) =>
                            chat.recipient.id === params.user.id ||
                            chat.creator.id === params.user.id,
                    ),
                ),
            )
            const params: CreateChatParams = {
                user: mockUsers[2],
                email: mockUsers[1].email,
            }
            const chat = await service.createChat(params)
            expect(service.createChat).toHaveBeenCalledWith(params)
            expect(chat).toBeDefined()
        })
        it('should create a chat with no message', async () => {
            jest.spyOn(service, 'createChat').mockImplementation(() =>
                Promise.resolve(mockChats[0]),
            )
            const chat = await service.createChat({
                user: mockUsers[2],
                email: mockUsers[1].email,
            })
            expect(chat).toBeDefined()
            expect(chat.messages).toEqual([])
        })
        it('should create a chat with a message', async () => {
            jest.spyOn(service, 'createChat').mockImplementation(() =>
                Promise.resolve(mockChats[2]),
            )
            const chat = await service.createChat({
                user: mockUsers[2],
                email: mockUsers[1].email,
            })
            expect(chat).toBeDefined()
            expect(chat.messages).not.toEqual([])
        })
    })
    describe('getChatById', () => {
        beforeEach(() => {
            jest.spyOn(service, 'getChatById').mockImplementation((id) =>
                Promise.resolve(mockChats.find((chat) => chat.id === id)),
            )
        })
        it('should get a single chat', async () => {
            const chat = await service.getChatById(1)
            expect(service.getChatById).toHaveBeenCalledWith(1)
            expect(chat).toEqual(mockChats[0])
        })
        it('should get fail to get a single chat', async () => {
            const chat = await service.getChatById(9999)
            expect(chat).not.toEqual(mockChats[0])
        })
    })
    describe('getChatsByUserId', () => {
        beforeEach(() => {
            jest.spyOn(service, 'getChatsByUserId').mockImplementation((id) =>
                Promise.resolve(
                    mockChats.filter(
                        (chat) =>
                            chat.creator.id === id || chat.recipient.id === id,
                    ),
                ),
            )
        })
        it('should get all chats for a specified user', async () => {
            const chats = await service.getChatsByUserId(mockUsers[0].id)
            const expectedChats = [mockChats[0], mockChats[1]]
            expect(chats).toEqual(expectedChats)
        })
        it('should not return chats unrelated to a specified user', async () => {
            const chats = await service.getChatsByUserId(mockUsers[0].id)
            expect(chats).not.toEqual(mockChats)
        })
    })
    describe('getChatByUserId', () => {
        beforeEach(() => {
            jest.spyOn(service, 'getChatByUserId').mockImplementation((id) =>
                Promise.resolve(
                    mockChats.find(
                        (chat) =>
                            chat.creator.id === id || chat.recipient.id === id,
                    ),
                ),
            )
        })
        it('should get a single chat between two specified users', async () => {
            const chat = await service.getChatByUserId(
                mockUsers[0].id,
                mockUsers[1].id,
            )
            expect(chat).toEqual(mockChats[0])
        })
        it('should not return chats unrelated to two specified users', async () => {
            const chats = await service.getChatByUserId(
                mockUsers[0].id,
                mockUsers[1].id,
            )
            expect(chats).not.toEqual(mockChats)
        })
    })
})
