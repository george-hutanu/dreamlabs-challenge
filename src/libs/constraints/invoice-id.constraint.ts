import { Injectable } from '@nestjs/common'
import { ValidatorConstraint } from 'class-validator'

import { InvoiceService } from '~invoice/services/invoice.service'
import { AbstractConstraint } from '~libs/constraints/abstract.constraint'

@Injectable()
@ValidatorConstraint({ name: 'invoiceIdExists', async: true })
export class InvoiceIdConstraint extends AbstractConstraint<string> {
  protected errorMessage!: string

  public constructor(private readonly service: InvoiceService) {
    super()
  }

  public async validate(id: string): Promise<boolean> {
    this.errorMessage = `Invoice with id: ${id} does not exist`
    const entity = await this.service.findOneById(id)
    return Boolean(entity)
  }
}
