import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { CreateCommand } from '~customer/commands'
import { Customer } from '~customer/customer.entity'
import { CustomerService } from '~customer/customer.service'

@CommandHandler(CreateCommand)
export class CreateHandler implements ICommandHandler<CreateCommand> {
  public constructor(private readonly service: CustomerService) {}

  public async execute(command: CreateCommand): Promise<Customer> {
    const { name } = command.createCustomerDTO
    return this.service.insert({ name })
  }
}
