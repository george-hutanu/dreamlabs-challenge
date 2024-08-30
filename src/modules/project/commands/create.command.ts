import { ICommand } from '@nestjs/cqrs'

import { CreateProjectDTO } from '~project/commands/dtos'

export class CreateCommand implements ICommand {
  public constructor(public readonly createProjectDTO: CreateProjectDTO) {}
}
