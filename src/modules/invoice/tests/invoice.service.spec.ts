import { faker } from '@faker-js/faker'
import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Invoice } from '~invoice/invoice.entity'
import { InvoiceService } from '~invoice/services/invoice.service'
import { InvoiceEntitySpec } from '~invoice/tests/invoice.entity-spec'

describe('InvoiceService', () => {
  let service: InvoiceService
  let repository: jest.Mocked<Repository<Invoice>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getRepositoryToken(Invoice),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<InvoiceService>(InvoiceService)
    repository = module.get<Repository<Invoice>>(getRepositoryToken(Invoice)) as jest.Mocked<Repository<Invoice>>
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should insert a new invoice', async () => {
    repository.create.mockReturnValue(InvoiceEntitySpec)
    repository.save.mockResolvedValue(InvoiceEntitySpec)
    const amount = faker.number.int({ max: 999 })

    const result = await service.insert({ amount })

    expect(result).toEqual(InvoiceEntitySpec)
    expect(repository.create).toHaveBeenCalledWith({ amount })
    expect(repository.save).toHaveBeenCalledWith(InvoiceEntitySpec)
  })

  it('should find all invoices', async () => {
    repository.find.mockResolvedValue([InvoiceEntitySpec])

    const result = await service.findAll()

    expect(result).toEqual([InvoiceEntitySpec])
    expect(repository.find).toHaveBeenCalled()
  })

  it('should find one invoice by id', async () => {
    repository.findOneBy.mockResolvedValue(InvoiceEntitySpec)

    const result = await service.findOneById(InvoiceEntitySpec.id)

    expect(result).toEqual(InvoiceEntitySpec)
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: InvoiceEntitySpec.id })
  })

  it('should update an existing invoice', async () => {
    const amount = faker.number.int({ max: 999 })
    repository.findOneBy.mockResolvedValue(InvoiceEntitySpec)
    repository.save.mockResolvedValue({ ...InvoiceEntitySpec, amount })

    const result = await service.update(InvoiceEntitySpec.id, { amount })

    expect(result).toEqual({ ...InvoiceEntitySpec, amount })
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: InvoiceEntitySpec.id })
    expect(repository.save).toHaveBeenCalledWith({ ...InvoiceEntitySpec, amount })
  })

  it('should throw NotFoundException if invoice to update does not exist', async () => {
    const id = faker.string.uuid()

    repository.findOneBy.mockResolvedValue(undefined)

    await expect(service.update(id, { amount: faker.number.int({ max: 999 }) })).rejects.toThrow(NotFoundException)
    expect(repository.findOneBy).toHaveBeenCalledWith({ id })
  })
})
