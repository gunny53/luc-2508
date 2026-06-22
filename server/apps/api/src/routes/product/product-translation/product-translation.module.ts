import { Module } from '@nestjs/common'
import { ProductTranslationController } from '@routes/product/product-translation/product-translation.controller'
import { ProductTranslationRepo } from '@routes/product/product-translation/product-translation.repo'
import { ProductTranslationService } from '@routes/product/product-translation/product-translation.service'

@Module({
  providers: [ProductTranslationRepo, ProductTranslationService],
  controllers: [ProductTranslationController]
})
export class ProductTranslationModule {}
