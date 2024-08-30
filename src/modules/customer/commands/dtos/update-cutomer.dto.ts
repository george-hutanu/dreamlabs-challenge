import { InputType, PartialType } from '@nestjs/graphql'

import { CreateCustomerDTO } from '~customer/commands/dtos/create-cutomer.dto'

@InputType()
export class UpdateCustomerDTO extends PartialType(CreateCustomerDTO) {}
