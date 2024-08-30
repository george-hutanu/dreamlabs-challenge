import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, Validate } from 'class-validator'

import { InvoiceIdConstraint } from '~libs/constraints/invoice-id.constraint'

@InputType()
export class InvoiceIdDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Validate(InvoiceIdConstraint)
  public readonly id: string
}
