import { ICommand } from '@nestjs/cqrs'

import { UpdateInvoiceDTO } from '~invoice/commands/dtos'

export class UpdateCommand implements ICommand {
  public constructor(public readonly updateInvoiceDTO: UpdateInvoiceDTO) {}
}
