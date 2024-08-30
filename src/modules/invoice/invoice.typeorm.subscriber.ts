import { Injectable } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm'

import { Invoice } from '~invoice/invoice.entity'

@Injectable()
@EventSubscriber()
export class InvoiceSubscriber implements EntitySubscriberInterface<Invoice> {
  public listenTo(): typeof Invoice {
    return Invoice
  }

  public async beforeInsert(event: InsertEvent<Invoice>): Promise<void> {
    const [lastInvoiceGenerated] = await event.manager.find(Invoice, { order: { invoiceNumber: 'DESC' } })
    event.entity.invoiceNumber = lastInvoiceGenerated ? lastInvoiceGenerated.invoiceNumber + 1 : 1337
  }
}
