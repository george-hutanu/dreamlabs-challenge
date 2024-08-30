import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { MarkAsUnpaidCommand } from '~invoice/commands'
import { Invoice } from '~invoice/invoice.entity'
import { InvoiceService } from '~invoice/services/invoice.service'
import { InvoiceStatus } from '~libs/constants'
import { InvoiceEvents } from '~libs/events'

@CommandHandler(MarkAsUnpaidCommand)
export class MarkInvoiceAsUnpaidHandler implements ICommandHandler<MarkAsUnpaidCommand> {
  public constructor(
    private readonly invoiceService: InvoiceService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(command: MarkAsUnpaidCommand): Promise<Invoice> {
    const invoice = await this.invoiceService.update(command.id, { status: InvoiceStatus.UNPAID })
    this.eventEmitter.emit(InvoiceEvents.INVOICE_UNPAID, invoice)
    return invoice
  }
}
