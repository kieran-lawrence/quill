import { Test, TestingModule } from '@nestjs/testing'
import { GroupMessageService } from './message.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Services, GroupMessageEntity } from '@repo/api'
import { Repository } from 'typeorm'

describe('GroupMessageService', () => {
    const token = getRepositoryToken(GroupMessageEntity)

    let service: GroupMessageService
    let messageRepository: Repository<GroupMessageEntity>
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GroupMessageService,
                {
                    provide: token,
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: Services.GROUP,
                    useValue: {
                        findUser: jest.fn(),
                    },
                },
            ],
        }).compile()

        service = module.get<GroupMessageService>(GroupMessageService)
        messageRepository = module.get<Repository<GroupMessageEntity>>(token)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
    it('messageRepository should be defined', () => {
        expect(messageRepository).toBeDefined()
    })
})
