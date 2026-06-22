import { Module } from '@nestjs/common'
import { BrandController } from '@routes/brand/brand.controller'
import { BrandRepo } from '@routes/brand/brand.repo'
import { BrandService } from '@routes/brand/brand.service'

@Module({
  providers: [BrandService, BrandRepo],
  controllers: [BrandController]
})
export class BrandModule {}
