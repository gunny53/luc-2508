import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { ShippingController } from './shipping-ghn.controller'
import { ShippingService } from './shipping-ghn.service'
import { ShippingRepo } from './shipping-ghn.repo'
import { ShippingConsumer } from '@shared/queue/consumer/shipping.consumer'
import { SHIPPING_QUEUE_NAME } from '@shared/constants/queue.constant'

@Module({
  imports: [
    BullModule.registerQueue({
      name: SHIPPING_QUEUE_NAME
    })
  ],
  providers: [ShippingService, ShippingRepo, ShippingConsumer],
  controllers: [ShippingController],
  exports: [ShippingService]
})
export class ShippingModule {}
