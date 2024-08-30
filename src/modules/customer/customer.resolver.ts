import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CreateCommand } from '~customer/commands'
import { CreateCustomerDTO } from '~customer/commands/dtos'
import { Customer } from '~customer/customer.entity'
import { GetOneQuery } from '~customer/queries'
import { CustomerDTO, CustomerIdDTO } from '~customer/queries/dtos'

@Injectable()
@Resolver(() => Customer)
export class CustomerResolver {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => CustomerDTO)
  public async getCustomer(@Args('idPayload') { id }: CustomerIdDTO): Promise<Customer | null> {
    return this.queryBus.execute(new GetOneQuery(id))
  }

  @Mutation(() => CustomerDTO)
  public async createCustomer(@Args('createCustomerInput') createCustomerInput: CreateCustomerDTO): Promise<Customer> {
    return this.commandBus.execute(new CreateCommand(createCustomerInput))
  }
}
