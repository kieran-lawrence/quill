import { Test, TestingModule } from '@nestjs/testing'
import { FriendService } from './friend.service'
import { Repository } from 'typeorm'
import { Friend } from '../../utils/typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Services } from '../../utils/constants'

describe('FriendService', () => {
    let service: FriendService
    let friendRepository: Repository<Friend>

    const token = getRepositoryToken(Friend)

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
        friendRepository = module.get<Repository<Friend>>(token)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
    it('friendRepository should be defined', () => {
        expect(friendRepository).toBeDefined()
    })
})
