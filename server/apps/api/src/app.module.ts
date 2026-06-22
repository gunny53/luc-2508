import { Module } from '@nestjs/common'
import { SharedModule } from '@shared/shared.module'
import { AuthModule } from '@routes/auth/auth.module'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import CustomZodValidationPipe from '@shared/pipes/custom-zod-validation.pipe'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { HttpExceptionFilter } from '@shared/filters/http-exception.filter'
import { PermissionModule } from '@routes/permission/permission.module'
import { RoleModule } from '@routes/role/role.module'
import { ProfileModule } from '@routes/profile/profile.module'
import { UserModule } from '@routes/user/user.module'
import { MediaModule } from '@routes/media/media.module'
import { BrandModule } from '@routes/brand/brand.module'
import { BrandTranslationModule } from '@routes/brand/brand-translation/brand-translation.module'
import { CategoryModule } from '@routes/category/category.module'
import { CategoryTranslationModule } from '@routes/category/category-translation/category-translation.module'
import { ProductModule } from '@routes/product/product.module'
import { ProductTranslationModule } from '@routes/product/product-translation/product-translation.module'
import { CartModule } from '@routes/cart/cart.module'
import { OrderModule } from '@routes/order/order.module'
import { SepayModule } from '@routes/payment/sepay/sepay.module'
import { VNPayModule } from '@routes/payment/vnpay/vnpay.module'
import { WebsocketModule } from '@websockets/websocket.module'
import { ThrottlerBehindProxyGuard } from '@shared/guards/throttler-behind-proxy.guard'
import { ReviewModule } from '@routes/review/review.module'
import { RemoveRefreshTokenCronjob } from '@cronjobs/remove-refresh-token.cronjob'
import { TransformInterceptor } from '@shared/interceptor/transform.interceptor'
import { ExpireDiscountCronjob } from '@cronjobs/expire-discount.cronjob'
import { ScheduleModule } from '@nestjs/schedule'
import { LanguageModule } from '@routes/language/language.module'
import { DiscountModule } from './routes/discount/discount.module'
import { SearchModule } from './routes/search/search.module'
import { ShippingModule } from './routes/shipping/ghn/shipping-ghn.module'
import { HealthController } from '@api/health.controller'
import { TerminusModule } from '@nestjs/terminus'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TerminusModule,
    WebsocketModule,
    SharedModule,
    AuthModule,
    PermissionModule,
    RoleModule,
    ProfileModule,
    UserModule,
    MediaModule,
    BrandModule,
    BrandTranslationModule,
    CategoryModule,
    CategoryTranslationModule,
    ProductModule,
    ProductTranslationModule,
    CartModule,
    OrderModule,
    SepayModule,
    VNPayModule,
    ReviewModule,
    DiscountModule,
    LanguageModule,
    SearchModule,
    ShippingModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe
    },

    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard
    },
    RemoveRefreshTokenCronjob,
    ExpireDiscountCronjob
  ],
  controllers: [HealthController]
})
export class AppModule {}
