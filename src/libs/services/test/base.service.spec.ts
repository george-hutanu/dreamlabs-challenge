import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseEntity } from '~libs/entities'
import { BaseService } from '~libs/services'

class TestEntity extends BaseEntity {
  public id: string
  public name: string
}

describe('BaseService', () => {
  let service: BaseService<TestEntity>
  let repository: jest.Mocked<Repository<TestEntity>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BaseService,
          useFactory: (repo: Repository<TestEntity>) => new BaseService(repo),
          inject: [getRepositoryToken(TestEntity)],
        },
        {
          provide: getRepositoryToken(TestEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<BaseService<TestEntity>>(BaseService)
    repository = module.get<Repository<TestEntity>>(getRepositoryToken(TestEntity)) as jest.Mocked<
      Repository<TestEntity>
    >
  })

  it('should insert a new entity', async () => {
    const entity = { id: '1', name: 'Test' } as TestEntity
    repository.create.mockReturnValue(entity)
    repository.save.mockResolvedValue(entity)

    const result = await service.insert({ name: 'Test' })

    expect(result).toEqual(entity)
    expect(repository.create).toHaveBeenCalledWith({ name: 'Test' })
    expect(repository.save).toHaveBeenCalledWith(entity)
  })

  it('should find all entities', async () => {
    const entities = [{ id: '1', name: 'Test' }] as TestEntity[]
    repository.find.mockResolvedValue(entities)

    const result = await service.findAll()

    expect(result).toEqual(entities)
    expect(repository.find).toHaveBeenCalled()
  })

  it('should find one entity by id', async () => {
    const entity = { id: '1', name: 'Test' } as TestEntity
    repository.findOneBy.mockResolvedValue(entity)

    const result = await service.findOneById('1')

    expect(result).toEqual(entity)
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' })
  })

  it('should find one entity by condition', async () => {
    const entity = { id: '1', name: 'Test' } as TestEntity
    repository.findOneBy.mockResolvedValue(entity)

    const result = await service.findOneBy({ name: 'Test' })

    expect(result).toEqual(entity)
    expect(repository.findOneBy).toHaveBeenCalledWith({ name: 'Test' })
  })

  it('should update an existing entity', async () => {
    const entity = { id: '1', name: 'Test' } as TestEntity
    repository.findOneBy.mockResolvedValue(entity)
    repository.save.mockResolvedValue({ ...entity, name: 'Updated' })

    const result = await service.update('1', { name: 'Updated' })

    expect(result).toEqual({ ...entity, name: 'Updated' })
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' })
    expect(repository.save).toHaveBeenCalledWith({ ...entity, name: 'Updated' })
  })

  it('should throw NotFoundException if entity to update does not exist', async () => {
    repository.findOneBy.mockResolvedValue(undefined)

    await expect(service.update('1', { name: 'Updated' })).rejects.toThrow(NotFoundException)
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' })
  })
})
