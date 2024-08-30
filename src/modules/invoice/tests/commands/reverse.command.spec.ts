import { faker } from '@faker-js/faker'

import { ReverseCommand } from '~invoice/commands'

describe('ReverseCommand', () => {
  const id: string = faker.string.uuid()

  it('should be defined', () => {
    const command = new ReverseCommand(id)

    expect(command).toBeDefined()
  })

  it('should correctly assign the id property', () => {
    const command = new ReverseCommand(id)

    expect(command.id).toBe(id)
  })
})
