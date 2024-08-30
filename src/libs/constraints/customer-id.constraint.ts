import { Injectable } from '@nestjs/common'
import { ValidatorConstraint } from 'class-validator'

import { CustomerService } from '~customer/customer.service'
import { AbstractConstraint } from '~libs/constraints/abstract.constraint'

@Injectable()
@ValidatorConstraint({ name: 'customerIdExists', async: true })
export class CustomerIdConstraint extends AbstractConstraint<string> {
  protected errorMessage!: string

  public constructor(private readonly service: CustomerService) {
    super()
  }

  public async validate(id: string): Promise<boolean> {
    this.errorMessage = `Customer with id: ${id} does not exist`
    const entity = await this.service.findOneById(id)
    return Boolean(entity)
  }
}
