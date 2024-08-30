import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { Invoice } from '~invoice/invoice.entity'
import { GetManyQuery } from '~invoice/query'
import { InvoiceService } from '~invoice/services/invoice.service'

@QueryHandler(GetManyQuery)
export class GetManyHandler implements IQueryHandler<GetManyQuery> {
  public constructor(private readonly invoiceService: InvoiceService) {}

  public async execute({ limit }: GetManyQuery): Promise<Invoice[]> {
    return this.invoiceService.findAll({ limit })
  }
}
