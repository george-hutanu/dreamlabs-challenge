import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Customer } from '~customer/customer.entity'
import { BaseService } from '~libs/services'

@Injectable()
export class CustomerService extends BaseService<Customer> {
  public constructor(
    @InjectRepository(Customer)
    protected readonly repository: Repository<Customer>,
  ) {
    super(repository)
  }
}
