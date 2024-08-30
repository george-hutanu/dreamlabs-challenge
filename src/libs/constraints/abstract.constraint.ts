import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator'

import { BaseEntity } from '~libs/entities'

export abstract class AbstractConstraint<T extends BaseEntity | string> implements ValidatorConstraintInterface {
  protected abstract errorMessage: string

  public abstract validate(entity: T, validationArguments?: ValidationArguments): boolean | Promise<boolean>

  public defaultMessage(): string {
    return this.errorMessage
  }
}
