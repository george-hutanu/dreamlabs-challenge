import { faker } from '@faker-js/faker'
import { Test, TestingModule } from '@nestjs/testing'

import { Invoice } from '~invoice/invoice.entity'
import { GetManyQuery } from '~invoice/query'
import { GetManyHandler } from '~invoice/query/handlers/get-many.handler'
import { InvoiceService } from '~invoice/services/invoice.service'
import { InvoiceCurrency, InvoiceStatus } from '~libs/constants'

describe('GetManyHandler', () => {
  let handler: GetManyHandler
  let invoiceService: jest.Mocked<InvoiceService>
  const limit = 10

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetManyHandler,
        {
          provide: InvoiceService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile()

    handler = module.get<GetManyHandler>(GetManyHandler)
    invoiceService = module.get<InvoiceService>(InvoiceService) as jest.Mocked<InvoiceService>
  })

  it('should be defined', () => {
    expect(handler).toBeDefined()
  })

  it('should return a list of invoices', async () => {
    const mockInvoices: Invoice[] = new Array(2).fill({
      id: faker.string.uuid(),
      invoiceNumber: faker.number.int({ min: 1, max: 10000 }),
      amount: faker.number.int({ min: 1, max: 1000 }),
      currency: faker.helpers.enumValue(InvoiceCurrency),
      date: faker.date.recent(),
      status: faker.helpers.enumValue(InvoiceStatus),
      isStorno: faker.datatype.boolean(),
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      customer: undefined,
      project: undefined,
    })

    invoiceService.findAll.mockResolvedValue(mockInvoices)

    const query = new GetManyQuery(limit)
    const result = await handler.execute(query)

    expect(invoiceService.findAll).toHaveBeenCalledWith({ limit })
    expect(result).toEqual(mockInvoices)
  })

  it('should handle empty result when no invoices are found', async () => {
    invoiceService.findAll.mockResolvedValue([])

    const query = new GetManyQuery(limit)
    const result = await handler.execute(query)

    expect(invoiceService.findAll).toHaveBeenCalledWith({ limit })
    expect(result).toEqual([])
  })
})
