import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { UpdateCommand } from '~invoice/commands'
import { Invoice } from '~invoice/invoice.entity'
import { InvoiceService } from '~invoice/services/invoice.service'
import { InvoiceEvents } from '~libs/events'

@CommandHandler(UpdateCommand)
export class UpdateInvoiceHandler implements ICommandHandler<UpdateCommand> {
  public constructor(
    private readonly invoiceService: InvoiceService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(command: UpdateCommand): Promise<Invoice> {
    const invoice = await this.invoiceService.update(command.updateInvoiceDTO.id, command.updateInvoiceDTO)
    this.eventEmitter.emit(InvoiceEvents.INVOICE_UPDATED, invoice)
    return invoice
  }
}
