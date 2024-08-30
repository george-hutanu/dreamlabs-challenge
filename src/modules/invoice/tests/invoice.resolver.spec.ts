import { faker } from '@faker-js/faker'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Test, TestingModule } from '@nestjs/testing'

import { CustomerService } from '~customer/customer.service'
import { CreateInvoiceDTO, UpdateInvoiceDTO } from '~invoice/commands/dtos'
import { InvoiceResolver } from '~invoice/invoice.resolver'
import { CreateUpdateAppointmentBodyPipe } from '~invoice/pipes'
import { InvoiceEntitySpec } from '~invoice/tests/invoice.entity-spec'
import { InvoiceCurrency } from '~libs/constants'
import { ProjectService } from '~project/project.service'

describe('InvoiceResolver', () => {
  let resolver: InvoiceResolver
  let commandBus: jest.Mocked<CommandBus>
  let queryBus: jest.Mocked<QueryBus>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceResolver,
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CustomerService,
          useValue: {},
        },
        {
          provide: ProjectService,
          useValue: {},
        },
        {
          provide: CreateUpdateAppointmentBodyPipe,
          useValue: {
            transform: jest.fn().mockImplementation((value) => value),
          },
        },
      ],
    }).compile()

    resolver = module.get<InvoiceResolver>(InvoiceResolver)
    commandBus = module.get<CommandBus>(CommandBus) as jest.Mocked<CommandBus>
    queryBus = module.get<QueryBus>(QueryBus) as jest.Mocked<QueryBus>
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  it('should get all invoices', async () => {
    queryBus.execute.mockResolvedValue([InvoiceEntitySpec])

    const result = await resolver.getInvoices(5)

    expect(result).toEqual([InvoiceEntitySpec])
    expect(queryBus.execute).toHaveBeenCalled()
  })

  it('should get an invoice by invoice number', async () => {
    queryBus.execute.mockResolvedValue(InvoiceEntitySpec)

    const result = await resolver.getInvoiceByInvoiceNumber(InvoiceEntitySpec.invoiceNumber)

    expect(result).toEqual(InvoiceEntitySpec)
    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({ invoiceNumber: InvoiceEntitySpec.invoiceNumber }),
    )
  })

  it('should create a new invoice', async () => {
    const createInvoiceData: CreateInvoiceDTO = {
      amount: faker.number.int({ max: 999 }),
      currency: faker.helpers.enumValue(InvoiceCurrency),
    }
    const insertedInvoice = { ...InvoiceEntitySpec, ...createInvoiceData }
    commandBus.execute.mockResolvedValue(insertedInvoice)

    const result = await resolver.createInvoice(createInvoiceData)

    expect(result).toEqual(insertedInvoice)
    expect(commandBus.execute).toHaveBeenCalledWith(expect.objectContaining({ createInvoiceDTO: createInvoiceData }))
  })

  it('should update an invoice', async () => {
    const updateInvoiceData: UpdateInvoiceDTO = { id: InvoiceEntitySpec.id, amount: faker.number.int({ max: 999 }) }
    const updatedInvoice = { ...InvoiceEntitySpec, ...updateInvoiceData }
    commandBus.execute.mockResolvedValue(updatedInvoice)

    const result = await resolver.updateInvoice(updateInvoiceData)

    expect(result).toEqual(updatedInvoice)
    expect(commandBus.execute).toHaveBeenCalledWith(expect.objectContaining({ updateInvoiceDTO: updateInvoiceData }))
  })

  it('should mark an invoice as paid', async () => {
    commandBus.execute.mockResolvedValue(InvoiceEntitySpec)

    const result = await resolver.markInvoiceAsPaid({ id: InvoiceEntitySpec.id })

    expect(result).toEqual(InvoiceEntitySpec)
    expect(commandBus.execute).toHaveBeenCalledWith(expect.objectContaining({ id: InvoiceEntitySpec.id }))
  })

  it('should mark an invoice as unpaid', async () => {
    commandBus.execute.mockResolvedValue(InvoiceEntitySpec)

    const result = await resolver.markInvoiceAsUnpaid({ id: InvoiceEntitySpec.id })

    expect(result).toEqual(InvoiceEntitySpec)
    expect(commandBus.execute).toHaveBeenCalledWith(expect.objectContaining({ id: InvoiceEntitySpec.id }))
  })

  it('should reverse an invoice', async () => {
    commandBus.execute.mockResolvedValue(InvoiceEntitySpec)

    const result = await resolver.reverseInvoice({ id: InvoiceEntitySpec.id })

    expect(result).toEqual(InvoiceEntitySpec)
    expect(commandBus.execute).toHaveBeenCalledWith(expect.objectContaining({ id: InvoiceEntitySpec.id }))
  })
})
