import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Log } from '~libs/decorators'
import { CreateCommand } from '~project/commands'
import { CreateProjectDTO } from '~project/commands/dtos'
import { Project } from '~project/project.entity'
import { GetOneQuery } from '~project/queries'
import { ProjectDTO, ProjectIdDTO } from '~project/queries/dtos'

@Injectable()
@Resolver(() => Project)
@Log()
export class ProjectResolver {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => ProjectDTO)
  public async getOne(@Args('idPayload') { id }: ProjectIdDTO): Promise<Project> {
    return this.queryBus.execute(new GetOneQuery(id))
  }

  @Mutation(() => ProjectDTO)
  public async createProject(@Args('createProject') createProjectData: CreateProjectDTO): Promise<Project> {
    return this.commandBus.execute(new CreateCommand(createProjectData))
  }
}
