import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { Customer } from '~customer/customer.entity'
import { CustomerService } from '~customer/customer.service'
import { GetOneQuery } from '~customer/queries'

@QueryHandler(GetOneQuery)
export class GetCustomerHandler implements IQueryHandler<GetOneQuery> {
  public constructor(private readonly customerService: CustomerService) {}

  public async execute(query: GetOneQuery): Promise<Customer | null> {
    const { id } = query
    return this.customerService.findOneById(id)
  }
}
