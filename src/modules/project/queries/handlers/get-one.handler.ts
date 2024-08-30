import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { Project } from '~project/project.entity'
import { ProjectService } from '~project/project.service'
import { GetOneQuery } from '~project/queries'

@QueryHandler(GetOneQuery)
export class GetOneHandler implements IQueryHandler<GetOneQuery> {
  public constructor(private readonly service: ProjectService) {}

  public async execute(query: GetOneQuery): Promise<Project | null> {
    return this.service.findOneById(query.id)
  }
}
