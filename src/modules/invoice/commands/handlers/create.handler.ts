import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { CreateCommand } from '~invoice/commands'
import { Invoice } from '~invoice/invoice.entity'
import { InvoiceService } from '~invoice/services/invoice.service'
import { InvoiceEvents } from '~libs/events'

@CommandHandler(CreateCommand)
export class CreateInvoiceHandler implements ICommandHandler<CreateCommand> {
  public constructor(
    private readonly invoiceService: InvoiceService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(command: CreateCommand): Promise<Invoice> {
    const invoice = await this.invoiceService.insert(command.createInvoiceDTO)
    this.eventEmitter.emit(InvoiceEvents.INVOICE_CREATED, invoice)
    return invoice
  }
}
