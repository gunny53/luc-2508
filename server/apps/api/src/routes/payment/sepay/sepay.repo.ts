import { BadRequestException, Injectable } from '@nestjs/common'
import { parse } from 'date-fns'
import { WebhookPaymentBodyType } from '@routes/payment/sepay/sepay.model'
import { PaymentProducer } from '@shared/queue/producer/payment.producer'
import { PREFIX_PAYMENT_CODE } from '@shared/constants/other.constant'
import { PrismaService } from '@shared/services/prisma.service'
import { SharedPaymentRepository } from '@shared/repositories/shared-payment.repo'

@Injectable()
export class SepayRepo {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly paymentProducer: PaymentProducer,
    private readonly sharedPaymentRepository: SharedPaymentRepository
  ) {}

  async receiver(body: WebhookPaymentBodyType): Promise<{ userId: string; paymentId: number }> {
    let amountIn = 0
    let amountOut = 0
    if (body.transferType === 'in') amountIn = body.transferAmount
    else if (body.transferType === 'out') amountOut = body.transferAmount

    const paymentTransaction = await this.prismaService.paymentTransaction.findUnique({
      where: { id: body.id }
    })
    if (paymentTransaction) throw new BadRequestException('Transaction already exists')

    const result = await this.prismaService.$transaction(async (tx) => {
      await tx.paymentTransaction.create({
        data: {
          id: body.id,
          gateway: body.gateway,
          transactionDate: parse(body.transactionDate, 'yyyy-MM-dd HH:mm:ss', new Date()),
          accountNumber: body.accountNumber,
          subAccount: body.subAccount,
          amountIn,
          amountOut,
          accumulated: body.accumulated,
          code: body.code,
          transactionContent: body.content,
          referenceNumber: body.referenceCode,
          body: body.description
        }
      })
      const paymentId = this.sharedPaymentRepository.extractPaymentId(
        PREFIX_PAYMENT_CODE,
        ...(body.code ? [body.code] : []),
        ...(body.content ? [body.content] : [])
      )
      if (!paymentId) throw new BadRequestException('Cannot get payment id from content')
      const payment = await this.sharedPaymentRepository.validateAndFindPayment(Number(paymentId))
      const userId = payment.orders[0].userId
      const { orders } = payment
      this.sharedPaymentRepository.validatePaymentAmount(
        this.sharedPaymentRepository.getTotalPrice(orders),
        body.transferAmount
      )
      await this.sharedPaymentRepository.updatePaymentAndOrdersOnSuccess(Number(paymentId), orders)

      return { userId, paymentId: Number(paymentId) }
    })

    return result
  }
}
