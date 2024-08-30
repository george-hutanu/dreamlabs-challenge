import { faker } from '@faker-js/faker'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test, TestingModule } from '@nestjs/testing'

import { MarkAsUnpaidCommand } from '~invoice/commands'
import { MarkInvoiceAsUnpaidHandler } from '~invoice/commands/handlers'
import { Invoice } from '~invoice/invoice.entity'
import { InvoiceService } from '~invoice/services/invoice.service'
import { InvoiceCurrency, InvoiceStatus } from '~libs/constants'
import { InvoiceEvents } from '~libs/events'

describe('MarkInvoiceAsUnpaidHandler', () => {
  let handler: MarkInvoiceAsUnpaidHandler
  let invoiceService: jest.Mocked<InvoiceService>
  let eventEmitter: jest.Mocked<EventEmitter2>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarkInvoiceAsUnpaidHandler,
        {
          provide: InvoiceService,
          useValue: {
            update: jest.fn(),
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

    handler = module.get<MarkInvoiceAsUnpaidHandler>(MarkInvoiceAsUnpaidHandler)
    invoiceService = module.get<InvoiceService>(InvoiceService) as jest.Mocked<InvoiceService>
    eventEmitter = module.get<EventEmitter2>(EventEmitter2) as jest.Mocked<EventEmitter2>
  })

  it('should be defined', () => {
    expect(handler).toBeDefined()
  })

  it('should mark an invoice as unpaid and emit an event', async () => {
    const id = faker.string.uuid()
    const updatedInvoice: Invoice = {
      id,
      amount: faker.number.int({ min: 1, max: 10000 }),
      currency: faker.helpers.enumValue(InvoiceCurrency),
      invoiceNumber: faker.number.int({ min: 1, max: 10000 }),
      date: faker.date.recent(),
      status: InvoiceStatus.UNPAID,
      isStorno: faker.datatype.boolean(),
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      customer: undefined,
      project: undefined,
    }

    invoiceService.update.mockResolvedValue(updatedInvoice)

    const command = new MarkAsUnpaidCommand(id)
    const result = await handler.execute(command)

    expect(invoiceService.update).toHaveBeenCalledWith(id, { status: InvoiceStatus.UNPAID })
    expect(result).toEqual(updatedInvoice)
    expect(eventEmitter.emit).toHaveBeenCalledWith(InvoiceEvents.INVOICE_UNPAID, updatedInvoice)
  })
})
