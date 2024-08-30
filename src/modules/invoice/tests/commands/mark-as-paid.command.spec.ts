import { faker } from '@faker-js/faker'

import { MarkAsPaidCommand } from '~invoice/commands'

describe('MarkAsPaidCommand', () => {
  const id: string = faker.string.uuid()

  it('should be defined', () => {
    const command = new MarkAsPaidCommand(id)

    expect(command).toBeDefined()
  })

  it('should correctly assign the id property', () => {
    const command = new MarkAsPaidCommand(id)

    expect(command.id).toBe(id)
  })
})
