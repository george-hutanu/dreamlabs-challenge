import { faker } from '@faker-js/faker'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test, TestingModule } from '@nestjs/testing'

import { CreateCommand } from '~invoice/commands'
import { CreateInvoiceDTO } from '~invoice/commands/dtos'
import { CreateInvoiceHandler } from '~invoice/commands/handlers'
import { Invoice } from '~invoice/invoice.entity'
import { InvoiceService } from '~invoice/services/invoice.service'
import { InvoiceCurrency, InvoiceStatus } from '~libs/constants'
import { InvoiceEvents } from '~libs/events'

describe('CreateInvoiceHandler', () => {
  let handler: CreateInvoiceHandler
  let invoiceService: jest.Mocked<InvoiceService>
  let eventEmitter: jest.Mocked<EventEmitter2>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateInvoiceHandler,
        {
          provide: InvoiceService,
          useValue: {
            insert: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile()

    handler = module.get<CreateInvoiceHandler>(CreateInvoiceHandler)
    invoiceService = module.get<InvoiceService>(InvoiceService) as jest.Mocked<InvoiceService>
    eventEmitter = module.get<EventEmitter2>(EventEmitter2) as jest.Mocked<EventEmitter2>
  })

  it('should be defined', () => {
    expect(handler).toBeDefined()
  })

  it('should create an invoice and emit an event', async () => {
    const createInvoiceDTO: CreateInvoiceDTO = {
      amount: faker.number.int({ min: 1, max: 10000 }),
      currency: faker.helpers.enumValue(InvoiceCurrency),
    }

    const createdInvoice: Invoice = {
      customer: undefined,
      project: undefined,
      invoiceNumber: faker.number.int({ min: 1, max: 10000 }),
      id: faker.string.uuid(),
      amount: createInvoiceDTO.amount,
      currency: createInvoiceDTO.currency,
      date: faker.date.recent(),
      status: faker.helpers.enumValue(InvoiceStatus),
      isStorno: faker.datatype.boolean(),
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    }

    invoiceService.insert.mockResolvedValue(createdInvoice)

    const command = new CreateCommand(createInvoiceDTO)
    const result = await handler.execute(command)

    expect(invoiceService.insert).toHaveBeenCalledWith(createInvoiceDTO)
    expect(result).toEqual(createdInvoice)
    expect(eventEmitter.emit).toHaveBeenCalledWith(InvoiceEvents.INVOICE_CREATED, createdInvoice)
  })
})
