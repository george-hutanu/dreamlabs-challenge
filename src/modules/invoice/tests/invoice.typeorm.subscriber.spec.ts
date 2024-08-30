import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { EntityManager, InsertEvent } from 'typeorm'

import { Invoice } from '~invoice/invoice.entity'
import { InvoiceSubscriber } from '~invoice/invoice.typeorm.subscriber'
import { InvoiceEntitySpec } from '~invoice/tests/invoice.entity-spec'

describe('InvoiceSubscriber', () => {
  let subscriber: InvoiceSubscriber
  let entityManager: EntityManager

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceSubscriber,
        {
          provide: getRepositoryToken(Invoice),
          useValue: {},
        },
        {
          provide: EntityManager,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile()

    subscriber = module.get<InvoiceSubscriber>(InvoiceSubscriber)
    entityManager = module.get<EntityManager>(EntityManager)
  })

  it('should set invoiceNumber to last invoice number + 1', async () => {
    jest.spyOn(entityManager, 'find').mockResolvedValueOnce([InvoiceEntitySpec])
    const initialInvoiceNumber = InvoiceEntitySpec.invoiceNumber

    const event = {
      entity: InvoiceEntitySpec,
      manager: entityManager,
    } as InsertEvent<Invoice>

    await subscriber.beforeInsert(event)

    expect(event.entity.invoiceNumber).toBe(initialInvoiceNumber + 1)
  })

  it('should set invoiceNumber to 1337 if no invoices exist', async () => {
    jest.spyOn(entityManager, 'find').mockResolvedValueOnce([])

    const event = {
      entity: InvoiceEntitySpec,
      manager: entityManager,
    } as InsertEvent<Invoice>

    await subscriber.beforeInsert(event)

    expect(event.entity.invoiceNumber).toBe(1337)
  })
})
