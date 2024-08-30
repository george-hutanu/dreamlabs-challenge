import { InputType, PartialType } from '@nestjs/graphql'

import { CreateProjectDTO } from '~project/commands/dtos/create-project.dto'

@InputType()
export class UpdateProjectDTO extends PartialType(CreateProjectDTO) {}
