import { Test, TestingModule } from '@nestjs/testing'
import { GroupService } from './group.service'
import { Services } from '../../utils/constants'
import { getRepositoryToken } from '@nestjs/typeorm'
import { GroupChat, GroupMessage } from '../../utils/typeorm'
import { Repository } from 'typeorm'

describe('GroupService', () => {
    const MessageRepositoryToken = getRepositoryToken(GroupMessage)
    const ChatRepositoryToken = getRepositoryToken(GroupChat)

    let service: GroupService
    let messageRepository: Repository<GroupMessage>
    let chatRepository: Repository<GroupChat>
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

        messageRepository = module.get<Repository<GroupMessage>>(
            MessageRepositoryToken,
        )
        chatRepository = module.get<Repository<GroupChat>>(ChatRepositoryToken)
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
