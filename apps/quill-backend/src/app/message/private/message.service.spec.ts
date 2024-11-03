import { Test, TestingModule } from '@nestjs/testing'
import { PrivateMessageService } from './message.service'
import { Services } from '../../../utils/constants'
import { PrivateMessage } from '../../../utils/typeorm'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('PrivateMessageService', () => {
    const token = getRepositoryToken(PrivateMessage)

    let service: PrivateMessageService
    let messageRepository: Repository<PrivateMessage>
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
        messageRepository = module.get<Repository<PrivateMessage>>(token)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
    it('messageRepository should be defined', () => {
        expect(messageRepository).toBeDefined()
    })
})
