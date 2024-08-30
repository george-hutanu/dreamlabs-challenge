import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { CreateCommand } from '~project/commands'
import { Project } from '~project/project.entity'
import { ProjectService } from '~project/project.service'

@CommandHandler(CreateCommand)
export class CreateHandler implements ICommandHandler<CreateCommand> {
  public constructor(private readonly service: ProjectService) {}

  public async execute(command: CreateCommand): Promise<Project> {
    return this.service.insert(command.createProjectDTO)
  }
}
