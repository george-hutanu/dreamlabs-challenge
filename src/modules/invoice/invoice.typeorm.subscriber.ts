import { Injectable } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm'

import { START_INVOICE_NUMBER } from '~invoice/constants'
import { Invoice } from '~invoice/invoice.entity'

@Injectable()
@EventSubscriber()
export class InvoiceSubscriber implements EntitySubscriberInterface<Invoice> {
  public listenTo(): typeof Invoice {
    return Invoice
  }

  public async beforeInsert(event: InsertEvent<Invoice>): Promise<void> {
    const [lastInvoiceGenerated] = await event.manager.find(Invoice, { order: { invoiceNumber: 'DESC' } })
    event.entity.invoiceNumber = lastInvoiceGenerated
      ? this.getNextInvoiceNumber(lastInvoiceGenerated.invoiceNumber)
      : START_INVOICE_NUMBER
  }

  private getNextInvoiceNumber(invoiceNumber: number): number {
    return invoiceNumber + 1
  }
}
