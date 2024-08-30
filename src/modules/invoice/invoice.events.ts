import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { InvoiceEvents } from '~libs/events'

@Injectable()
export class InvoiceEventsSubscriber {
  public constructor(private readonly logger: Logger) {}
  @OnEvent(InvoiceEvents.INVOICE_CREATED)
  public handleInvoiceCreatedEvent(payload: unknown): void {
    this.logger.log('This is the handler for invoice creation.', 'InvoiceEventsSubscriber')
    this.logger.log(
      'Here you can perform any side effects like sending emails, updating other entities, etc.',
      'InvoiceEventsSubscriber',
    )
    this.logger.log('You can also use the payload to perform the side effects.', 'InvoiceEventsSubscriber')
    this.logger.log(`Payload: ${JSON.stringify(payload)}`, 'InvoiceEventsSubscriber')
  }

  @OnEvent(InvoiceEvents.INVOICE_PAID)
  public handleInvoicePaidEvent(payload: unknown): void {
    this.logger.log('This is the handler for invoice payment.', 'InvoiceEventsSubscriber')
    this.logger.log(
      'Here you can perform any side effects like sending emails, updating other entities, etc.',
      'InvoiceEventsSubscriber',
    )
    this.logger.log('You can also use the payload to perform the side effects.', 'InvoiceEventsSubscriber')
    this.logger.log(`Payload: ${JSON.stringify(payload)}`, 'InvoiceEventsSubscriber')
  }
}
