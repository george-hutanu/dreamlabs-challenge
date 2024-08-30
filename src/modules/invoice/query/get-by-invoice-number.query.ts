import { IQuery } from '@nestjs/cqrs'

export class GetByInvoiceNumberQuery implements IQuery {
  public constructor(public readonly invoiceNumber: number) {}
}
