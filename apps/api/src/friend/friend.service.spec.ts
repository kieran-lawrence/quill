import { Test, TestingModule } from '@nestjs/testing'
import { FriendService } from './friend.service'
import { Repository } from 'typeorm'
import { FriendEntity, Services } from '@repo/api'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('FriendService', () => {
    let service: FriendService
    let friendRepository: Repository<FriendEntity>

    const token = getRepositoryToken(FriendEntity)

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FriendService,
                {
                    provide: token,
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

        service = module.get<FriendService>(FriendService)
        friendRepository = module.get<Repository<FriendEntity>>(token)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
    it('friendRepository should be defined', () => {
        expect(friendRepository).toBeDefined()
    })
})
