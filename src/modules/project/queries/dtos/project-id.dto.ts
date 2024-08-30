import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, Validate } from 'class-validator'

import { ProjectIdConstraint } from '~libs/constraints/project-id.constraint'

@InputType()
export class ProjectIdDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Validate(ProjectIdConstraint)
  public readonly id: string
}
