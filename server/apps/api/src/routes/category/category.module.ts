import { Module } from '@nestjs/common'
import { CategoryController } from '@routes/category/category.controller'
import { CategoryRepo } from '@routes/category/category.repo'
import { CategoryService } from '@routes/category/category.service'

@Module({
  providers: [CategoryService, CategoryRepo],
  controllers: [CategoryController]
})
export class CategoryModule {}
