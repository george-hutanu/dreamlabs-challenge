import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'

import { CustomerService } from '~customer/customer.service'
import { CreateInvoiceDTO } from '~invoice/commands/dtos/create-invoice.dto'
import { UpdateInvoiceDTO } from '~invoice/commands/dtos/update-invoice.dto'
import { ProjectService } from '~project/project.service'

@Injectable()
export class CreateUpdateAppointmentBodyPipe implements PipeTransform {
  public constructor(
    private readonly customerService: CustomerService,
    private readonly projectService: ProjectService,
  ) {}

  public async transform(
    value: CreateInvoiceDTO | UpdateInvoiceDTO,
    metadata: ArgumentMetadata,
  ): Promise<CreateInvoiceDTO | UpdateInvoiceDTO> {
    if (metadata.type === 'body' && value.customerId) {
      value.customer = await this.customerService.findOneById(value.customerId)
      delete value.customerId
    }

    if (metadata.type === 'body' && value.projectId) {
      value.project = await this.projectService.findOneById(value.projectId)
      delete value.projectId
    }

    return value
  }
}
