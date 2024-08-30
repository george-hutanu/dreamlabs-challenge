import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class CreateCustomerDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  public readonly name: string
}
