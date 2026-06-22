import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { PAYMENT_QUEUE_NAME } from '@shared/constants/queue.constant'
import { generateCancelPaymentJobId } from '@shared/helpers'

@Injectable()
export class PaymentProducer {
  constructor(@InjectQueue(PAYMENT_QUEUE_NAME) private paymentQueue: Queue) {}

  removeJob(paymentId: number) {
    return this.paymentQueue.remove(generateCancelPaymentJobId(paymentId))
  }
}
