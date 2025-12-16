import { Test, TestingModule } from '@nestjs/testing'
import { GroupService } from './group.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { GroupChatEntity, GroupMessageEntity, Services } from '@repo/api'
import { Repository } from 'typeorm'

describe('GroupService', () => {
    const MessageRepositoryToken = getRepositoryToken(GroupMessageEntity)
    const ChatRepositoryToken = getRepositoryToken(GroupChatEntity)

    let service: GroupService
    let messageRepository: Repository<GroupMessageEntity>
    let chatRepository: Repository<GroupChatEntity>
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GroupService,
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

        messageRepository = module.get<Repository<GroupMessageEntity>>(
            MessageRepositoryToken,
        )
        chatRepository =
            module.get<Repository<GroupChatEntity>>(ChatRepositoryToken)
        service = module.get<GroupService>(GroupService)
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
})
