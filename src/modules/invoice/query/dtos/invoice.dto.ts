import { Field, Int, ObjectType } from '@nestjs/graphql'

import { CustomerDTO } from '~customer/queries/dtos/customer.dto'
import { InvoiceCurrency, InvoiceStatus } from '~libs/constants'
import { BaseDTO } from '~libs/dto'
import { ProjectDTO } from '~project/queries/dtos/project.dto'

@ObjectType()
export class InvoiceDTO extends BaseDTO {
  @Field(() => Int)
  public readonly invoiceNumber: number

  @Field()
  public readonly date: Date

  @Field()
  public readonly currency: InvoiceCurrency

  @Field()
  public readonly amount: number

  @Field()
  public readonly status: InvoiceStatus

  @Field(() => CustomerDTO)
  public readonly customer: CustomerDTO

  @Field(() => ProjectDTO)
  public readonly project: ProjectDTO

  @Field({ defaultValue: false })
  public readonly isStorno: boolean
}
