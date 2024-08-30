import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { MarkAsPaidCommand } from '~invoice/commands'
import { Invoice } from '~invoice/invoice.entity'
import { InvoiceService } from '~invoice/services/invoice.service'
import { InvoiceStatus } from '~libs/constants'
import { InvoiceEvents } from '~libs/events'

@CommandHandler(MarkAsPaidCommand)
export class MarkInvoiceAsPaidHandler implements ICommandHandler<MarkAsPaidCommand> {
  public constructor(
    private readonly invoiceService: InvoiceService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(command: MarkAsPaidCommand): Promise<Invoice> {
    const invoice = await this.invoiceService.update(command.id, { status: InvoiceStatus.PAID })
    this.eventEmitter.emit(InvoiceEvents.INVOICE_PAID, invoice)
    return invoice
  }
}
