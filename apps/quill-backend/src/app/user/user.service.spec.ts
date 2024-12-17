import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from '../../utils/typeorm'
import { Repository } from 'typeorm'
import * as bcryptMethods from '../../utils/helpers'
describe('UserService', () => {
    const RepositoryToken = getRepositoryToken(User)
    let service: UserService
    let userRepository: Repository<User>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: RepositoryToken,
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
            ],
        }).compile()

        service = module.get<UserService>(UserService)
        userRepository = module.get<Repository<User>>(RepositoryToken)
    })

    it('userService should be defined', () => {
        expect(service).toBeDefined()
    })
    it('userRepository should be defined', async () => {
        expect(userRepository).toBeDefined()
    })
    it('findUser', async () => {
        jest.spyOn(service, 'findUser').mockResolvedValue({
            id: 1,
            email: 'a@a.com',
            username: 'test',
            password: 'test1234',
            firstName: 'test',
            lastName: 'test',
            messages: [],
            groupChats: [],
            onlineStatus: 'offline',
        })
        await service.findUser({ id: 1 })
        expect(service.findUser).toHaveBeenCalledWith({ id: 1 })
    })
    describe('createUser', () => {
        jest.spyOn(bcryptMethods, 'hashPassword').mockResolvedValue('test1234')
        it('it should correctly hash a password', async () => {
            await service.createUser({
                email: 'a@a.com',
                username: 'test',
                password: 'test1234',
                firstName: 'test',
                lastName: 'test',
            })
            expect(bcryptMethods.hashPassword).toHaveBeenCalledWith('test1234')
        })
        it('it should create a new user', async () => {
            await service.createUser({
                email: 'a@a.com',
                username: 'test',
                password: 'test1234',
                firstName: 'test',
                lastName: 'test',
            })
            expect(userRepository.create).toHaveBeenCalledWith({
                email: 'a@a.com',
                username: 'test',
                password: 'test1234',
                firstName: 'test',
                lastName: 'test',
            })
        })
        it('it should save a newly created user', async () => {
            jest.spyOn(userRepository, 'create').mockReturnValueOnce({
                id: 1,
                email: 'a@a.com',
                username: 'test',
                password: 'test1234',
                firstName: 'test',
                lastName: 'test',
                messages: [],
                groupChats: [],
                onlineStatus: 'offline',
            })
            await service.createUser({
                email: 'a@a.com',
                username: 'test',
                password: 'test1234',
                firstName: 'test',
                lastName: 'test',
            })
            expect(userRepository.save).toHaveBeenCalledWith({
                id: 1,
                email: 'a@a.com',
                username: 'test',
                password: 'test1234',
                firstName: 'test',
                lastName: 'test',
                messages: [],
                groupChats: [],
                onlineStatus: 'offline',
            })
        })
    })
})
