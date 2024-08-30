import { ICommand } from '@nestjs/cqrs'

import { CreateCustomerDTO } from '~customer/commands/dtos'

export class CreateCommand implements ICommand {
  public constructor(public readonly createCustomerDTO: CreateCustomerDTO) {}
}
