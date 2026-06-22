import { Module } from '@nestjs/common'
import { ChatGateway } from '@websockets/chat.gateway'
import { PaymentGateway } from '@websockets/payment.gateway'

@Module({
  providers: [ChatGateway, PaymentGateway]
})
export class WebsocketModule {}
