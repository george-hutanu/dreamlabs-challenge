import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { Invoice } from '~invoice/invoice.entity'
import { GetByInvoiceNumberQuery } from '~invoice/query'
import { InvoiceService } from '~invoice/services/invoice.service'

@QueryHandler(GetByInvoiceNumberQuery)
export class GetByInvoiceNumberHandler implements IQueryHandler<GetByInvoiceNumberQuery> {
  public constructor(private readonly invoiceService: InvoiceService) {}

  public async execute({ invoiceNumber }: GetByInvoiceNumberQuery): Promise<Invoice | null> {
    return this.invoiceService.findOneBy({ invoiceNumber })
  }
}
