import { BadRequestException, Injectable } from '@nestjs/common'
import { PaymentStatus } from '@shared/constants/payment.constant'
import { VNPayReturnUrlType } from './vnpay.model'
import { PREFIX_PAYMENT_CODE } from '@shared/constants/other.constant'
import { PrismaService } from '@shared/services/prisma.service'
import { SharedPaymentRepository } from '@shared/repositories/shared-payment.repo'

@Injectable()
export class VNPayRepo {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly sharedPaymentRepository: SharedPaymentRepository
  ) {}

  async processVNPayWebhook(vnpayData: VNPayReturnUrlType): Promise<{ userId: string; paymentId: number }> {
    const existing = await this.prismaService.paymentTransaction.findFirst({
      where: { gateway: 'vnpay', referenceNumber: vnpayData.vnp_TransactionNo }
    })
    if (existing) throw new BadRequestException('Transaction already processed')

    const result = await this.prismaService.$transaction(async (tx) => {
      await tx.paymentTransaction.create({
        data: {
          gateway: 'vnpay',
          transactionDate: new Date(),
          accountNumber: vnpayData.vnp_BankCode,
          subAccount: vnpayData.vnp_BankTranNo,
          amountIn: Number(vnpayData.vnp_Amount) / 100,
          amountOut: 0,
          accumulated: 0,
          code: vnpayData.vnp_TxnRef,
          transactionContent: vnpayData.vnp_OrderInfo,
          referenceNumber: vnpayData.vnp_TransactionNo,
          body: JSON.stringify(vnpayData)
        }
      })
      
      const paymentId = this.sharedPaymentRepository.extractPaymentId(
        PREFIX_PAYMENT_CODE,
        vnpayData.vnp_OrderInfo,
        vnpayData.vnp_TxnRef
      )
      if (!paymentId) throw new BadRequestException('Cannot extract payment ID from VNPay data')
      const payment = await this.sharedPaymentRepository.validateAndFindPayment(paymentId)
      const userId = payment.orders[0].userId
      const { orders } = payment
      const actualAmount = Number(vnpayData.vnp_Amount) / 100
      this.sharedPaymentRepository.validatePaymentAmount(
        this.sharedPaymentRepository.getTotalPrice(orders),
        actualAmount
      )
      await this.sharedPaymentRepository.updatePaymentAndOrdersOnSuccess(paymentId, orders)
      return { userId, paymentId }
    })
    return result
  }

  async verifyIpnCall(queryData: VNPayReturnUrlType) {
    const paymentId = this.sharedPaymentRepository.extractPaymentId(
      PREFIX_PAYMENT_CODE,
      queryData.vnp_TxnRef,
      queryData.vnp_OrderInfo
    )
    if (!paymentId) throw new BadRequestException('Cannot extract paymentId')
    const payment = await this.sharedPaymentRepository.validateAndFindPayment(paymentId)
    const orders = payment.orders
    const actualAmount = Number(queryData.vnp_Amount)
    this.sharedPaymentRepository.validatePaymentAmount(this.sharedPaymentRepository.getTotalPrice(orders), actualAmount)
    return { payment, orders, paymentId }
  }

  async createVNPayPayment(orderIds: string[]): Promise<number> {
    const payment = await this.prismaService.payment.create({ data: { status: PaymentStatus.PENDING } })
    await this.prismaService.order.updateMany({
      where: { id: { in: orderIds } },
      data: { paymentId: payment.id }
    })
    return payment.id
  }

  async updatePaymentAndOrdersOnSuccess(paymentId: number, orders: any[]) {
    return this.sharedPaymentRepository.updatePaymentAndOrdersOnSuccess(paymentId, orders)
  }

  async updatePaymentAndOrdersOnFailed(paymentId: number, orders: any[]) {
    return this.sharedPaymentRepository.updatePaymentAndOrdersOnFailed(paymentId, orders)
  }
}
