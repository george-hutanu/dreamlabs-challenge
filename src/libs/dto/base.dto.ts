import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class BaseDTO {
  @Field(() => ID)
  public readonly id: string

  @Field()
  public readonly createdAt: string

  @Field()
  public readonly updatedAt: string
}
