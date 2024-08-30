import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, Validate } from 'class-validator'

import { CustomerIdConstraint } from '~libs/constraints/customer-id.constraint'

@InputType()
export class CustomerIdDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Validate(CustomerIdConstraint)
  public readonly id: string
}
