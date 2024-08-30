import { faker } from '@faker-js/faker'

import { MarkAsUnpaidCommand } from '~invoice/commands'

describe('MarkAsUnpaidCommand', () => {
  const id: string = faker.string.uuid()

  it('should be defined', () => {
    const command = new MarkAsUnpaidCommand(id)

    expect(command).toBeDefined()
  })

  it('should correctly assign the id property', () => {
    const command = new MarkAsUnpaidCommand(id)

    expect(command.id).toBe(id)
  })
})
