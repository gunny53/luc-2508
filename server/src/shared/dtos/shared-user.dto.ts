import { createZodDto } from 'nestjs-zod'
import { GetUserProfileResSchema, UpdateProfileResSchema } from '../models/shared-user.model'

/* English content normalized from the original source text. */
export class GetUserProfileResDTO extends createZodDto(GetUserProfileResSchema) {}

/* English content normalized from the original source text. */
export class UpdateProfileResDTO extends createZodDto(UpdateProfileResSchema) {}
