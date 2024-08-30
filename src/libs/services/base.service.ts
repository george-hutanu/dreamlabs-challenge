import { Injectable, NotFoundException } from '@nestjs/common'
import { FindOptionsWhere, Repository } from 'typeorm'

import { BaseEntity } from '~libs/types'

@Injectable()
export class BaseService<T extends BaseEntity> {
  public constructor(protected readonly repository: Repository<T>) {}

  public async insert(data: Partial<T>): Promise<T> {
    const entity = this.repository.create(data as T)
    return this.repository.save(entity)
  }

  public async findAll({ limit }: { limit: number } = { limit: 100 }): Promise<T[]> {
    return this.repository.find({ take: limit })
  }

  public async findOneById(id: string): Promise<T | undefined> {
    return this.repository.findOneBy({ id } as FindOptionsWhere<T>)
  }

  public async findOneBy(where: FindOptionsWhere<T>): Promise<T | undefined> {
    return this.repository.findOneBy(where)
  }

  public async update(id: string, data: Partial<T>): Promise<T> {
    const entity = await this.findOneById(id)
    if (!entity) {
      throw new NotFoundException('Entity not found')
    }
    return this.repository.save({ ...entity, ...data } as T)
  }
}
