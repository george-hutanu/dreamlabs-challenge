import { faker } from '@faker-js/faker'
import { Test, TestingModule } from '@nestjs/testing'

import { Invoice } from '~invoice/invoice.entity'
import { GetByInvoiceNumberQuery } from '~invoice/query'
import { GetByInvoiceNumberHandler } from '~invoice/query/handlers/get-by-invoice-number.handler'
import { InvoiceService } from '~invoice/services/invoice.service'
import { InvoiceCurrency, InvoiceStatus } from '~libs/constants'

describe('GetByInvoiceNumberHandler', () => {
  let handler: GetByInvoiceNumberHandler
  let invoiceService: jest.Mocked<InvoiceService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetByInvoiceNumberHandler,
        {
          provide: InvoiceService,
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile()

    handler = module.get<GetByInvoiceNumberHandler>(GetByInvoiceNumberHandler)
    invoiceService = module.get<InvoiceService>(InvoiceService) as jest.Mocked<InvoiceService>
  })

  it('should be defined', () => {
    expect(handler).toBeDefined()
  })

  it('should return an invoice when found', async () => {
    const invoiceNumber = 123
    const mockInvoice: Invoice = {
      id: faker.string.uuid(),
      amount: faker.number.int({ min: 1, max: 1000 }),
      currency: faker.helpers.enumValue(InvoiceCurrency),
      date: faker.date.recent(),
      status: faker.helpers.enumValue(InvoiceStatus),
      isStorno: true,
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      invoiceNumber: faker.number.int({ min: 1, max: 1000 }),
      customer: undefined,
      project: undefined,
    }

    invoiceService.findOneBy.mockResolvedValue(mockInvoice)

    const query = new GetByInvoiceNumberQuery(invoiceNumber)
    const result = await handler.execute(query)

    expect(invoiceService.findOneBy).toHaveBeenCalledWith({ invoiceNumber })
    expect(result).toEqual(mockInvoice)
  })

  it('should return null when no invoice is found', async () => {
    const invoiceNumber = 456

    invoiceService.findOneBy.mockResolvedValue(null)

    const query = new GetByInvoiceNumberQuery(invoiceNumber)
    const result = await handler.execute(query)

    expect(invoiceService.findOneBy).toHaveBeenCalledWith({ invoiceNumber })
    expect(result).toBeNull()
  })
})
