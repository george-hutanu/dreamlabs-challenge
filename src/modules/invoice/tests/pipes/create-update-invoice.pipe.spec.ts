import { ArgumentMetadata } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { Customer } from '~customer/customer.entity'
import { CustomerService } from '~customer/customer.service'
import { CreateInvoiceDTO } from '~invoice/commands/dtos/create-invoice.dto'
import { UpdateInvoiceDTO } from '~invoice/commands/dtos/update-invoice.dto'
import { CreateUpdateAppointmentBodyPipe } from '~invoice/pipes'
import { Project } from '~project/project.entity'
import { ProjectService } from '~project/project.service'

describe('CreateUpdateAppointmentBodyPipe', () => {
  let pipe: CreateUpdateAppointmentBodyPipe
  let customerService: jest.Mocked<CustomerService>
  let projectService: jest.Mocked<ProjectService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUpdateAppointmentBodyPipe,
        {
          provide: CustomerService,
          useValue: {
            findOneById: jest.fn(),
          },
        },
        {
          provide: ProjectService,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile()

    pipe = module.get<CreateUpdateAppointmentBodyPipe>(CreateUpdateAppointmentBodyPipe)
    customerService = module.get<CustomerService>(CustomerService) as jest.Mocked<CustomerService>
    projectService = module.get<ProjectService>(ProjectService) as jest.Mocked<ProjectService>
  })

  it('should be defined', () => {
    expect(pipe).toBeDefined()
  })

  it('should transform CreateInvoiceDTO by adding customer and project', async () => {
    const createInvoiceDTO: CreateInvoiceDTO = { customerId: '1', projectId: '2' } as CreateInvoiceDTO
    const metadata: ArgumentMetadata = { type: 'body' }

    customerService.findOneById.mockResolvedValue({ id: '1', name: 'Customer' } as Customer)
    projectService.findOneById.mockResolvedValue({ id: '2', name: 'Project' } as Project)

    const result = await pipe.transform(createInvoiceDTO, metadata)

    expect(result.customer).toEqual({ id: '1', name: 'Customer' })
    expect(result.project).toEqual({ id: '2', name: 'Project' })
    expect(result.customerId).toBeUndefined()
    expect(result.projectId).toBeUndefined()
  })

  it('should transform UpdateInvoiceDTO by adding customer and project', async () => {
    const updateInvoiceDTO: UpdateInvoiceDTO = { customerId: '1', projectId: '2' } as UpdateInvoiceDTO
    const metadata: ArgumentMetadata = { type: 'body' }

    customerService.findOneById.mockResolvedValue({ id: '1', name: 'Customer' } as Customer)
    projectService.findOneById.mockResolvedValue({ id: '2', name: 'Project' } as Project)

    const result = await pipe.transform(updateInvoiceDTO, metadata)

    expect(result.customer).toEqual({ id: '1', name: 'Customer' })
    expect(result.project).toEqual({ id: '2', name: 'Project' })
    expect(result.customerId).toBeUndefined()
    expect(result.projectId).toBeUndefined()
  })
})
