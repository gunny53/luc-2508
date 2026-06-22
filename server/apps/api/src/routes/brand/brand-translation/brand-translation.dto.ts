import { createZodDto } from 'nestjs-zod'
import {
  CreateBrandTranslationBodySchema,
  GetBrandTranslationDetailResSchema,
  GetBrandTranslationParamsSchema,
  UpdateBrandTranslationBodySchema
} from '@routes/brand/brand-translation/brand-translation.model'

export class GetBrandTranslationDetailResDTO extends createZodDto(GetBrandTranslationDetailResSchema) {}
export class GetBrandTranslationParamsDTO extends createZodDto(GetBrandTranslationParamsSchema) {}

export class CreateBrandTranslationBodyDTO extends createZodDto(CreateBrandTranslationBodySchema) {}

export class UpdateBrandTranslationBodyDTO extends createZodDto(UpdateBrandTranslationBodySchema) {}
