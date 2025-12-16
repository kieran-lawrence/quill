import { Test, TestingModule } from '@nestjs/testing'
import { PrivateMessageService } from './message.service'
import { Services, PrivateMessageEntity } from '@repo/api'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('PrivateMessageService', () => {
    const token = getRepositoryToken(PrivateMessageEntity)

    let service: PrivateMessageService
    let messageRepository: Repository<PrivateMessageEntity>
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PrivateMessageService,
                {
                    provide: token,
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: Services.CHAT,
                    useValue: {
                        findUser: jest.fn(),
                    },
                },
            ],
        }).compile()

        service = module.get<PrivateMessageService>(PrivateMessageService)
        messageRepository = module.get<Repository<PrivateMessageEntity>>(token)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
    it('messageRepository should be defined', () => {
        expect(messageRepository).toBeDefined()
    })
})
