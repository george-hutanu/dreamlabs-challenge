import { faker } from '@faker-js/faker'

import { UpdateCommand } from '~invoice/commands'
import { UpdateInvoiceDTO } from '~invoice/commands/dtos'
import { InvoiceCurrency } from '~libs/constants'

describe('UpdateCommand', () => {
  const updateInvoiceDTO: UpdateInvoiceDTO = {
    id: faker.string.uuid(),
    amount: faker.number.int({ max: 1000 }),
    currency: faker.helpers.enumValue(InvoiceCurrency),
  }

  it('should be defined', () => {
    const command = new UpdateCommand(updateInvoiceDTO)

    expect(command).toBeDefined()
  })

  it('should correctly assign the updateInvoiceDTO property', () => {
    const command = new UpdateCommand(updateInvoiceDTO)

    expect(command.updateInvoiceDTO).toBe(updateInvoiceDTO)
  })
})
