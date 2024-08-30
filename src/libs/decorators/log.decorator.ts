import { CustomDecorator, SetMetadata } from '@nestjs/common'

export const CLASS_LOGGING_KEY = 'class-logging'

export const Log = (): CustomDecorator<string> => SetMetadata(CLASS_LOGGING_KEY, true)
