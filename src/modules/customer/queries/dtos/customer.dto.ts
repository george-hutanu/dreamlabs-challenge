import { Field, ObjectType } from '@nestjs/graphql'

import { InvoiceDTO } from '~invoice/query/dtos/invoice.dto'
import { BaseDTO } from '~libs/dto'

@ObjectType()
export class CustomerDTO extends BaseDTO {
  @Field()
  public readonly name: string

  @Field(() => [InvoiceDTO])
  public readonly invoices: InvoiceDTO[]
}
