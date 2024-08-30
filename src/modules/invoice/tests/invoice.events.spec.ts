import { faker } from '@faker-js/faker'
import { Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { InvoiceEventsSubscriber } from '~invoice/invoice.events'

describe('InvoiceEventsSubscriber', () => {
  let subscriber: InvoiceEventsSubscriber
  let logger: jest.Mocked<Logger>
  const payload = { id: faker.string.uuid(), amount: faker.number.int({ max: 999 }) }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceEventsSubscriber,
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile()

    subscriber = module.get<InvoiceEventsSubscriber>(InvoiceEventsSubscriber)
    logger = module.get<Logger>(Logger) as jest.Mocked<Logger>
  })

  it('should handle invoice created event', () => {
    subscriber.handleInvoiceCreatedEvent(payload)
    expect(logger.log).toHaveBeenCalledWith(`Payload: ${JSON.stringify(payload)}`, 'InvoiceEventsSubscriber')
  })

  it('should handle invoice paid event', () => {
    subscriber.handleInvoicePaidEvent(payload)
    expect(logger.log).toHaveBeenCalledWith(`Payload: ${JSON.stringify(payload)}`, 'InvoiceEventsSubscriber')
  })
})
