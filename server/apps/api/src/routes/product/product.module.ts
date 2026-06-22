import { Module } from '@nestjs/common'
import { ManageProductController } from '@routes/product/manage-product/manage-product.controller'
import { ManageProductService } from '@routes/product/manage-product/manage-product.service'
import { ProductController } from '@routes/product/product.controller'
import { ProductRepo } from '@routes/product/product.repo'
import { ProductService } from '@routes/product/product.service'

@Module({
  providers: [ProductService, ManageProductService, ProductRepo],
  controllers: [ProductController, ManageProductController],
  exports: [ProductRepo]
})
export class ProductModule {}
