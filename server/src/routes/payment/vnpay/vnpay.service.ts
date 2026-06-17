import { Injectable, BadRequestException } from '@nestjs/common'
import { VnpayService } from 'nestjs-vnpay'
import {
  CreateVNPayPaymentBodyType,
  CreateVNPayPaymentResType,
  VNPayBankListResType,
  VNPayReturnUrlType,
  VNPayVerifyResType,
  VNPayQueryDrBodyType,
  VNPayQueryDrResType,
  VNPayRefundBodyType,
  VNPayRefundResType
} from './vnpay.model'
import { I18nService } from 'nestjs-i18n'
import {
  VNPayInvalidChecksumException,
  VNPayDuplicateRequestException,
  VNPayRefundAlreadyProcessedException,
  VNPayTransactionNotFoundException,
  VNPayServiceUnavailableException
} from './vnpay.error'
import { VNPayRepo } from './vnpay.repo'
import { SharedWebsocketRepository } from 'src/shared/repositories/shared-websocket.repo'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { generateRoomPaymentId, getDateInGMT7 } from 'src/shared/helpers'
import { I18nTranslations } from 'src/shared/languages/generated/i18n.generated'
import { PREFIX_PAYMENT_CODE } from 'src/shared/constants/other.constant'
import { PaymentStatus } from 'src/shared/constants/payment.constant'

/* English content normalized from the original source text. */
@Injectable()
@WebSocketGateway({ namespace: 'payment' })
export class VNPayService {
  @WebSocketServer()
  server: Server

  constructor(
    private readonly vnpayService: VnpayService,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly vnpayRepo: VNPayRepo,
    private readonly sharedWebsocketRepository: SharedWebsocketRepository
  ) {}

  /* English content normalized from the original source text. */
  async getBankList(): Promise<VNPayBankListResType> {
    try {
      const banks = await this.vnpayService.getBankList()
      return {
        message: this.i18n.t('payment.payment.vnpay.success.GET_BANK_LIST_SUCCESS'),
        data: banks.map((bank) => ({
          bankCode: bank.bank_code,
          bankName: bank.bank_name,
          bankLogo: bank.logo_link,
          bankType: bank.bank_type,
          displayOrder: bank.display_order
        }))
      }
    } catch {
      throw VNPayServiceUnavailableException
    }
  }

  /* English content normalized from the original source text. */
  async createPayment(paymentData: CreateVNPayPaymentBodyType): Promise<CreateVNPayPaymentResType> {
    try {
      const paymentId = paymentData.orderId
      const orderInfoWithPrefix = `${PREFIX_PAYMENT_CODE}${paymentId}`
      const orderIdWithPrefix = `${PREFIX_PAYMENT_CODE}${paymentId}`
      const buildPaymentData: any = {
        vnp_Amount: paymentData.amount,
        vnp_OrderInfo: orderInfoWithPrefix,
        vnp_TxnRef: orderIdWithPrefix,
        vnp_IpAddr: paymentData.ipAddr,
        vnp_ReturnUrl: paymentData.returnUrl,
        vnp_Locale: paymentData.locale,
        vnp_CurrCode: paymentData.currency,
        vnp_OrderType: paymentData.orderType
      }
      if (paymentData.ipnUrl) buildPaymentData.vnp_IpnUrl = paymentData.ipnUrl
      if (paymentData.bankCode) buildPaymentData.vnp_BankCode = paymentData.bankCode
      const paymentUrl = this.vnpayService.buildPaymentUrl(buildPaymentData, {
        withHash: true,
        logger: { type: 'all', loggerFn: (data) => console.log('BuildPaymentUrl log:', data.paymentUrl) }
      })
      return {
        message: this.i18n.t('payment.payment.vnpay.success.CREATE_PAYMENT_SUCCESS'),
        data: { paymentUrl }
      }
    } catch {
      throw VNPayServiceUnavailableException
    }
  }

  /* English content normalized from the original source text. */
  async verifyReturnUrl(queryData: VNPayReturnUrlType): Promise<VNPayVerifyResType> {
    try {
      const verify = await this.vnpayService.verifyReturnUrl(queryData)
      if (verify.isSuccess && verify.isVerified && verify.vnp_ResponseCode === '00') {
        const { userId, paymentId } = await this.vnpayRepo.processVNPayWebhook(queryData)

        // English content normalized from the original source text.
        this.server.to(generateRoomPaymentId(paymentId)).emit('payment', {
          status: 'success',
          gateway: 'vnpay',
          paymentId
        })
      }
      return {
        message: this.i18n.t('payment.payment.vnpay.success.VERIFY_RETURN_SUCCESS'),
        data: {
          isSuccess: verify.isSuccess,
          isVerified: verify.isVerified,
          message: verify.message,
          vnp_Amount: Number(verify.vnp_Amount) || 0,
          vnp_TxnRef: String(verify.vnp_TxnRef || ''),
          vnp_TransactionNo: String(verify.vnp_TransactionNo || ''),
          vnp_ResponseCode: String(verify.vnp_ResponseCode || ''),
          vnp_TransactionStatus: String(verify.vnp_TransactionStatus || '')
        }
      }
    } catch (error) {
      if (error.message?.includes('checksum')) throw VNPayInvalidChecksumException
      throw VNPayServiceUnavailableException
    }
  }

  /* English content normalized from the original source text. */
  async queryDr(queryData: VNPayQueryDrBodyType): Promise<VNPayQueryDrResType> {
    try {
      const queryRequest = {
        vnp_RequestId: queryData.requestId,
        vnp_IpAddr: queryData.ipAddr,
        vnp_TxnRef: queryData.orderId,
        vnp_TransactionNo: queryData.transactionNo,
        vnp_OrderInfo: queryData.orderInfo,
        vnp_TransactionDate: queryData.transactionDate,
        vnp_CreateDate: queryData.createDate
      }
      const result = await this.vnpayService.queryDr(queryRequest)
      return {
        message: this.i18n.t('payment.payment.vnpay.success.QUERY_DR_SUCCESS'),
        data: {
          isSuccess: result.isSuccess,
          isVerified: result.isVerified,
          message: result.message,
          vnp_Amount: Number(result.vnp_Amount) || 0,
          vnp_TxnRef: String(result.vnp_TxnRef || ''),
          vnp_TransactionNo: String(result.vnp_TransactionNo || ''),
          vnp_ResponseCode: String(result.vnp_ResponseCode || ''),
          vnp_TransactionStatus: String(result.vnp_TransactionStatus || '')
        }
      }
    } catch (error) {
      if (error.message?.includes('duplicate')) throw VNPayDuplicateRequestException
      if (error.message?.includes('not found')) throw VNPayTransactionNotFoundException
      throw VNPayServiceUnavailableException
    }
  }

  /* English content normalized from the original source text. */
  async refund(refundData: VNPayRefundBodyType): Promise<VNPayRefundResType> {
    try {
      const refundRequest = {
        vnp_RequestId: refundData.requestId,
        vnp_IpAddr: refundData.ipAddr,
        vnp_TxnRef: refundData.orderId,
        vnp_TransactionNo: refundData.transactionNo,
        vnp_Amount: refundData.amount,
        vnp_OrderInfo: refundData.orderInfo,
        vnp_TransactionDate: getDateInGMT7(),
        vnp_CreateDate: getDateInGMT7(),
        vnp_CreateBy: refundData.createBy,
        vnp_TransactionType: '02'
      }
      const result = await this.vnpayService.refund(refundRequest)
      return {
        message: this.i18n.t('payment.payment.vnpay.success.REFUND_SUCCESS'),
        data: {
          isSuccess: result.isSuccess,
          isVerified: result.isVerified,
          message: result.message,
          vnp_Amount: Number(result.vnp_Amount) || 0,
          vnp_TxnRef: String(result.vnp_TxnRef || ''),
          vnp_TransactionNo: String(result.vnp_TransactionNo || ''),
          vnp_ResponseCode: String(result.vnp_ResponseCode || ''),
          vnp_TransactionStatus: String(result.vnp_TransactionStatus || '')
        }
      }
    } catch (error) {
      if (error.message?.includes('already processed')) throw VNPayRefundAlreadyProcessedException
      if (error.message?.includes('not found')) throw VNPayTransactionNotFoundException
      throw VNPayServiceUnavailableException
    }
  }

  /* English content normalized from the original source text. */
  async processIpnCall(queryData: VNPayReturnUrlType): Promise<{ RspCode: string; Message: string }> {
    try {
      // English content normalized from the original source text.
      const verify = await this.vnpayService.verifyIpnCall(queryData)
      if (!verify.isVerified) {
        return { RspCode: '97', Message: 'Invalid Checksum' }
      }

      // English content normalized from the original source text.
      let payment, orders, paymentId
      try {
        // English content normalized from the original source text.
        const processedData = { ...queryData, vnp_Amount: String(verify.vnp_Amount) }
        const result = await this.vnpayRepo.verifyIpnCall(processedData)
        payment = result.payment
        orders = result.orders
        paymentId = result.paymentId
      } catch (err) {
        if (err instanceof BadRequestException) {
          if (err.message.includes('Cannot extract paymentId')) return { RspCode: '01', Message: 'Order not found' }
          if (err.message.includes('Cannot find payment')) return { RspCode: '01', Message: 'Order not found' }
          if (err.message.includes('Price not match')) return { RspCode: '04', Message: 'Invalid amount' }
        }
        throw err
      }

      // English content normalized from the original source text.
      if (payment.status === PaymentStatus.SUCCESS || payment.status === PaymentStatus.FAILED) {
        return { RspCode: '02', Message: 'Order already confirmed' }
      }

      // English content normalized from the original source text.
      if (queryData.vnp_ResponseCode === '00') {
        // English content normalized from the original source text.
        await this.vnpayRepo.updatePaymentAndOrdersOnSuccess(paymentId, orders)

        // English content normalized from the original source text.
        this.server.to(generateRoomPaymentId(paymentId)).emit('payment', {
          status: 'success',
          gateway: 'vnpay',
          paymentId
        })
      } else {
        // English content normalized from the original source text.
        await this.vnpayRepo.updatePaymentAndOrdersOnFailed(paymentId, orders)
        // English content normalized from the original source text.
      }
      // English content normalized from the original source text.
      return { RspCode: '00', Message: 'Confirm Success' }
    } catch (error) {
      console.error('VNPay IPN processing failed:', error)
      return { RspCode: '99', Message: 'Unknown error' }
    }
  }
}
