import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { ReverseCommand } from '~invoice/commands'
import { Invoice } from '~invoice/invoice.entity'
import { InvoiceService } from '~invoice/services/invoice.service'
import { InvoiceEvents } from '~libs/events'

@CommandHandler(ReverseCommand)
export class ReverseInvoiceHandler implements ICommandHandler<ReverseCommand> {
  public constructor(
    private readonly invoiceService: InvoiceService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(command: ReverseCommand): Promise<Invoice> {
    const invoice = await this.invoiceService.update(command.id, { isStorno: true })
    this.eventEmitter.emit(InvoiceEvents.INVOICE_REVERSED, invoice)
    return invoice
  }
}
