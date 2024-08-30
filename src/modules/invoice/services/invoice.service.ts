import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Invoice } from '~invoice/invoice.entity'
import { BaseService } from '~libs/services'

@Injectable()
export class InvoiceService extends BaseService<Invoice> {
  public constructor(
    @InjectRepository(Invoice)
    protected readonly repository: Repository<Invoice>,
  ) {
    super(repository)
  }
}
