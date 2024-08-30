import { ICommand } from '@nestjs/cqrs'

import { CreateInvoiceDTO } from '~invoice/commands/dtos'

export class CreateCommand implements ICommand {
  public constructor(public readonly createInvoiceDTO: CreateInvoiceDTO) {}
}
