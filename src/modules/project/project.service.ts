import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '~libs/services'
import { Project } from '~project/project.entity'

@Injectable()
export class ProjectService extends BaseService<Project> {
  public constructor(
    @InjectRepository(Project)
    protected readonly repository: Repository<Project>,
  ) {
    super(repository)
  }
}
