import { Module } from '@nestjs/common'
import { BrandTranslationController } from '@routes/brand/brand-translation/brand-translation.controller'
import { BrandTranslationRepo } from '@routes/brand/brand-translation/brand-translation.repo'
import { BrandTranslationService } from '@routes/brand/brand-translation/brand-translation.service'

@Module({
  providers: [BrandTranslationRepo, BrandTranslationService],
  controllers: [BrandTranslationController]
})
export class BrandTranslationModule {}
