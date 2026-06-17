import { Injectable, BadRequestException, Logger } from '@nestjs/common'
import { CreateOrderBodyType, GetOrderListQueryType } from 'src/routes/order/order.model'
import { OrderRepo } from 'src/routes/order/order.repo'
import { SharedDiscountRepository } from 'src/shared/repositories/shared-discount.repo'
import { SharedShippingRepository } from 'src/shared/repositories/shared-shipping.repo'
import { I18nService } from 'nestjs-i18n'
import { I18nTranslations } from 'src/shared/languages/generated/i18n.generated'
import { AccessTokenPayload } from 'src/shared/types/jwt.type'
import { ShippingProducer } from 'src/shared/queue/producer/shipping.producer'
import { GHN_PAYMENT_TYPE } from 'src/shared/constants/shipping.constants'
import { OrderShippingStatus } from 'src/shared/constants/order-shipping.constants'
import { normalizePhoneForGHN } from 'src/shared/helpers'
import { PricingService } from 'src/shared/services/pricing.service'
@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name)

  constructor(
    private readonly orderRepo: OrderRepo,
    private readonly sharedDiscountRepo: SharedDiscountRepository,
    private readonly sharedShippingRepo: SharedShippingRepository,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly shippingProducer: ShippingProducer,
    private readonly pricingService: PricingService
  ) {}

  async list(user: AccessTokenPayload, query: GetOrderListQueryType) {
    const data = await this.orderRepo.list(user.userId, query)

    // English content normalized from the original source text.
    const ordersWithPricing = await Promise.all(
      data.data.map(async (order) => {
        try {
          // English content normalized from the original source text.
          const orderShipping = await this.sharedShippingRepo.getOrderShippingInfo(order.id)

          // English content normalized from the original source text.
          const totalItemCost = (order.items || []).reduce((sum, item) => {
            return sum + item.skuPrice * item.quantity
          }, 0)

          const totalShippingFee = orderShipping?.shippingFee || 0

          // English content normalized from the original source text.
          let totalVoucherDiscount = 0

          // English content normalized from the original source text.
          if (order.discounts && order.discounts.length > 0) {
            totalVoucherDiscount = order.discounts.reduce((sum, discount) => {
              return sum + (discount.discountAmount || 0)
            }, 0)
          }

          // English content normalized from the original source text.
          // totalPayment = totalItemCost + totalShippingFee - totalVoucherDiscount
          // => totalVoucherDiscount = totalItemCost + totalShippingFee - totalPayment
          if (totalVoucherDiscount === 0 && orderShipping) {
            // English content normalized from the original source text.
            const expectedTotalPayment = orderShipping.codAmount || 0
            const calculatedVoucherDiscount = totalItemCost + totalShippingFee - expectedTotalPayment

            // English content normalized from the original source text.
            if (calculatedVoucherDiscount > 0 && calculatedVoucherDiscount < totalItemCost) {
              totalVoucherDiscount = calculatedVoucherDiscount
              this.logger.log(
                `[ORDER_SERVICE] Order ${order.id} - Calculated voucher discount: ${totalVoucherDiscount} from pricing logic`
              )
            }
          }

          const totalPayment = totalItemCost + totalShippingFee - totalVoucherDiscount

          this.logger.log(
            `[ORDER_SERVICE] Order ${order.id} - totalItemCost: ${totalItemCost}, totalShippingFee: ${totalShippingFee}, totalPayment: ${totalPayment}`
          )

          return {
            ...order,
            totalItemCost,
            totalShippingFee,
            totalVoucherDiscount,
            totalPayment
          }
        } catch (error) {
          this.logger.error(`English content normalized from the original source text.${order.id}: ${error.message}`)
          // English content normalized from the original source text.
          return {
            ...order,
            totalItemCost: 0,
            totalShippingFee: 0,
            totalVoucherDiscount: 0,
            totalPayment: 0
          }
        }
      })
    )

    return {
      message: this.i18n.t('order.order.success.GET_SUCCESS'),
      data: ordersWithPricing,
      metadata: data.metadata
    }
  }

  async create(user: AccessTokenPayload, body: CreateOrderBodyType) {
    this.logger.log(`English content normalized from the original source text.${user.userId}`)
    this.logger.log(`English content normalized from the original source text.${body.shops.length}`)
    this.logger.log(`[ORDER_CREATE] Body data: ${JSON.stringify(body, null, 2)}`)

    const shopDiscountCodes = body.shops
      .filter((shop) => shop.discountCodes && Array.isArray(shop.discountCodes))
      .flatMap((shop) => shop.discountCodes)
      .filter((code): code is string => code !== undefined)

    const platformDiscountCodes = body.platformDiscountCodes || []
    const allDiscountCodes = [...shopDiscountCodes, ...platformDiscountCodes]

    this.logger.log(`[ORDER_CREATE] Discount codes: ${JSON.stringify(allDiscountCodes)}`)

    if (allDiscountCodes.length > 0) {
      this.logger.log(`English content normalized from the original source text.`)
      // English content normalized from the original source text.
      const discounts = await this.sharedDiscountRepo.findDiscountsByCodes(allDiscountCodes)

      // English content normalized from the original source text.
      if (discounts.length !== allDiscountCodes.length) {
        const foundCodes = discounts.map((d) => d.code)
        const missingCodes = allDiscountCodes.filter((code) => !foundCodes.includes(code))
        throw new BadRequestException(`English content normalized from the original source text.${missingCodes.join(', ')}`)
      }

      const userUsageMap = await this.sharedDiscountRepo.getUserDiscountUsage(
        user.userId,
        discounts.map((d) => d.id)
      )

      this.logger.log(`[ORDER_CREATE] Discounts validated: ${discounts.length} codes`)

      for (const discount of discounts) {
        // English content normalized from the original source text.
        if (discount.discountStatus !== 'ACTIVE') {
          this.logger.error(
            `English content normalized from the original source text.${discount.id} - status: ${discount.discountStatus}`
          )
          throw new BadRequestException('English content normalized from the original source text.')
        }

        const now = new Date()
        if (now < discount.startDate || now > discount.endDate) {
          this.logger.error(
            `English content normalized from the original source text.${discount.id} - start: ${discount.startDate}, end: ${discount.endDate}, now: ${now}`
          )
          throw new BadRequestException('English content normalized from the original source text.')
        }

        // English content normalized from the original source text.
        if (discount.maxUses > 0 && discount.usesCount >= discount.maxUses) {
          this.logger.error(
            `English content normalized from the original source text.${discount.id} - used: ${discount.usesCount}, max: ${discount.maxUses}`
          )
          throw new BadRequestException('English content normalized from the original source text.')
        }

        // English content normalized from the original source text.
        if (discount.maxUsesPerUser && discount.maxUsesPerUser > 0) {
          const usedCount = userUsageMap.get(discount.id) || 0
          if (usedCount >= discount.maxUsesPerUser) {
            this.logger.error(
              `English content normalized from the original source text.${discount.id} - used: ${usedCount}, max: ${discount.maxUsesPerUser}`
            )
            throw new BadRequestException('English content normalized from the original source text.')
          }
        }
      }
    }

    this.logger.log(`English content normalized from the original source text.`)
    // English content normalized from the original source text.
    const calc = await this.pricingService.tinhTamTinhDonHang(user, {
      shops: body.shops.map((s) => ({
        shopId: s.shopId,
        cartItemIds: s.cartItemIds,
        shippingFee: s.shippingInfo?.shippingFee ?? 0,
        discountCodes: s.discountCodes
      })),
      platformDiscountCodes: body.platformDiscountCodes
    })

    this.logger.log(`[ORDER_CREATE] Pricing calculated: ${JSON.stringify(calc, null, 2)}`)

    const perShopMap = new Map<string, { payment: number; platformVoucherDiscount: number }>()
    ;(calc.shops || []).forEach((sh) =>
      perShopMap.set(sh.shopId, {
        payment: sh.payment,
        platformVoucherDiscount: sh.platformVoucherDiscount || 0
      })
    )

    this.logger.log(`English content normalized from the original source text.`)
    // English content normalized from the original source text.
    const result = await this.orderRepo.create(user.userId, body.shops)
    this.logger.log(`[ORDER_CREATE] Orders created: ${result.orders.length} orders, paymentId: ${result.paymentId}`)

    this.logger.log(`English content normalized from the original source text.`)
    await Promise.all(
      result.orders.map(async (order) => {
        this.logger.log(`English content normalized from the original source text.${order.id}, shopId: ${order.shopId}`)

        const shop = body.shops.find((s) => s.shopId === order.shopId)
        if (!shop?.shippingInfo) {
          this.logger.warn(`[ORDER_CREATE] Order ${order.id}English content normalized from the original source text.`)
          return
        }

        this.logger.log(
          `[ORDER_CREATE] Shipping info cho order ${order.id}: ${JSON.stringify(shop.shippingInfo, null, 2)}`
        )

        // English content normalized from the original source text.
        this.logger.log(`English content normalized from the original source text.${shop.shopId}`)
        const shopInfo = await this.sharedShippingRepo.getShopAddressForShipping(shop.shopId)
        const { shop: shopData, address: shopAddressRecord } = shopInfo

        this.logger.log(`[ORDER_CREATE] Shop data: ${JSON.stringify(shopData, null, 2)}`)
        this.logger.log(`[ORDER_CREATE] Shop address: ${JSON.stringify(shopAddressRecord, null, 2)}`)

        const info = shop.shippingInfo

        const isCod = shop.isCod === true
        const shopPayment = perShopMap.get(shop.shopId)
        const shippingFeeForShop = info.shippingFee ?? 0
        const codAmount = isCod ? Math.max(0, (shopPayment?.payment ?? 0) - shippingFeeForShop) : 0

        this.logger.log(
          `[ORDER_CREATE] Order ${order.id} - isCod: ${isCod}, codAmount: ${codAmount}, shopPayment: ${JSON.stringify(shopPayment)}`
        )

        // English content normalized from the original source text.
        this.logger.log(`English content normalized from the original source text.${order.id}`)
        const orderShipping = await this.sharedShippingRepo.createOrderShipping({
          orderId: order.id,
          serviceId: info.service_id,
          serviceTypeId: info.service_type_id,
          configFeeId: info.config_fee_id || '',
          extraCostId: info.extra_cost_id || '',
          weight: info.weight,
          length: info.length,
          width: info.width,
          height: info.height,
          shippingFee: info.shippingFee ?? 0,
          codAmount: codAmount,
          note: info.note,
          requiredNote: info.required_note || 'CHOTHUHANG',
          pickShift: info.pick_shift ? JSON.stringify(info.pick_shift) : null,
          status: OrderShippingStatus.DRAFT,
          fromAddress: shopAddressRecord.street || '',
          fromName: shopData.name,
          fromPhone: normalizePhoneForGHN(shopAddressRecord.phoneNumber || shopData.phoneNumber) || '0987654321',
          fromProvinceName: shopAddressRecord.province || '',
          fromDistrictName: shopAddressRecord.district || '',
          fromWardName: shopAddressRecord.ward || '',
          fromDistrictId: shopAddressRecord.districtId || 0,
          fromWardCode: shopAddressRecord.wardCode || '',
          toAddress: shop.receiver.address,
          toName: shop.receiver.name,
          toPhone: normalizePhoneForGHN(shop.receiver.phone),
          toDistrictId: shop.receiver.districtId || 0,
          toWardCode: shop.receiver.wardCode || ''
        })

        this.logger.log(`[ORDER_CREATE] OrderShipping created: ${JSON.stringify(orderShipping, null, 2)}`)

        // English content normalized from the original source text.
        // English content normalized from the original source text.
        if (isCod) {
          this.logger.log(`[ORDER_CREATE] Order ${order.id}English content normalized from the original source text.`)
          try {
            const ghnOrderData = {
              from_address: shopAddressRecord.street || '',
              from_name: shopData.name,
              from_phone: normalizePhoneForGHN(shopAddressRecord.phoneNumber || shopData.phoneNumber) || '0987654321',
              from_province_name: shopAddressRecord.province || '',
              from_district_name: shopAddressRecord.district || '',
              from_ward_name: shopAddressRecord.ward || '',

              to_name: shop.receiver.name,
              to_phone: normalizePhoneForGHN(shop.receiver.phone),
              to_address: shop.receiver.address,
              to_ward_code: shop.receiver.wardCode || '',
              to_district_id: shop.receiver.districtId || 0,

              client_order_code: `SSPX${order.id}`,
              // English content normalized from the original source text.
              cod_amount: codAmount,
              shippingFee: info.shippingFee ?? 0,
              content: undefined,
              weight: info.weight,
              length: info.length,
              width: info.width,
              height: info.height,
              pick_station_id: undefined,
              insurance_value: undefined,
              service_id: info.service_id,
              service_type_id: info.service_type_id,
              config_fee_id: info.config_fee_id,
              extra_cost_id: info.extra_cost_id,
              coupon: info.coupon ?? null,
              pick_shift: info.pick_shift,
              items: shop.cartItemIds.map((cartItemId) => ({
                name: `Item ${cartItemId.substring(0, 6)}`,
                quantity: 1,
                weight: info.weight,
                length: info.length,
                width: info.width,
                height: info.height
              })),
              payment_type_id: GHN_PAYMENT_TYPE.COD,
              note: info.note,
              required_note: info.required_note || 'CHOTHUHANG'
            }

            this.logger.log(`[ORDER_CREATE] GHN order data cho COD: ${JSON.stringify(ghnOrderData, null, 2)}`)

            await this.shippingProducer.enqueueCreateOrder(ghnOrderData)
            this.logger.log(`English content normalized from the original source text.${order.id}`)

            // English content normalized from the original source text.
            await this.sharedShippingRepo.updateOrderShippingStatus(order.id, OrderShippingStatus.ENQUEUED)
            this.logger.log(`[ORDER_CREATE] OrderShipping status updated to ENQUEUED cho order: ${order.id}`)
          } catch (error) {
            this.logger.error(`English content normalized from the original source text.${error.message}`, error.stack)
            console.error('Failed to enqueue COD shipping order:', error)
          }
        } else {
          this.logger.log(
            `[ORDER_CREATE] Order ${order.id}English content normalized from the original source text.`
          )
        }
      })
    )

    this.logger.log(`English content normalized from the original source text.`)
    // English content normalized from the original source text.
    await this.updateCodOrdersStatus(result.orders, body.shops)

    // English content normalized from the original source text.
    const updatedResult = this.updateCodOrdersInResponse(result, body.shops)

    this.logger.log(`English content normalized from the original source text.${JSON.stringify(updatedResult, null, 2)}`)
    return {
      message: this.i18n.t('order.order.success.CREATE_SUCCESS'),
      data: updatedResult
    }
  }

  async cancel(user: AccessTokenPayload, orderId: string) {
    this.logger.log(`English content normalized from the original source text.${orderId} cho user: ${user.userId}`)

    try {
      const result = await this.orderRepo.cancel(user.userId, orderId)
      this.logger.log(`[ORDER_SERVICE] Order cancelled successfully: ${JSON.stringify(result, null, 2)}`)

      const response = {
        message: this.i18n.t('order.order.success.CANCEL_SUCCESS'),
        data: result.data
      }

      this.logger.log(`[ORDER_SERVICE] Response: ${JSON.stringify(response, null, 2)}`)
      return response
    } catch (error) {
      this.logger.error(`English content normalized from the original source text.${error.message}`, error.stack)
      throw error
    }
  }

  async detail(user: AccessTokenPayload, orderId: string) {
    const result = await this.orderRepo.detail(user.userId, orderId)

    // English content normalized from the original source text.
    if (result.data) {
      const [orderShipping, ghnOrderCode] = await Promise.all([
        this.sharedShippingRepo.getOrderShippingInfo(result.data.id),
        this.sharedShippingRepo.getGHNOrderCode(result.data.id)
      ])

      // English content normalized from the original source text.
      if (orderShipping && orderShipping.shippingFee !== null) {
        result.data.totalShippingFee = orderShipping.shippingFee

        // English content normalized from the original source text.
        if (!result.data.totalVoucherDiscount || result.data.totalVoucherDiscount === 0) {
          // English content normalized from the original source text.
          const expectedTotalPayment = orderShipping.codAmount || 0
          const calculatedVoucherDiscount =
            (result.data.totalItemCost || 0) + orderShipping.shippingFee - expectedTotalPayment

          // English content normalized from the original source text.
          if (calculatedVoucherDiscount > 0 && calculatedVoucherDiscount < (result.data.totalItemCost || 0)) {
            result.data.totalVoucherDiscount = calculatedVoucherDiscount
            this.logger.log(
              `[ORDER_SERVICE] Order ${orderId} - Calculated voucher discount: ${calculatedVoucherDiscount} from pricing logic`
            )
          }
        }

        // English content normalized from the original source text.
        result.data.totalPayment =
          (result.data.totalItemCost || 0) + orderShipping.shippingFee - (result.data.totalVoucherDiscount || 0)
      }

      // English content normalized from the original source text.
      if (ghnOrderCode) {
        ;(result.data as any).orderCode = ghnOrderCode
      }

      // English content normalized from the original source text.
      if (result.data.totalItemCost === undefined) result.data.totalItemCost = 0
      if (result.data.totalVoucherDiscount === undefined) result.data.totalVoucherDiscount = 0
      if (result.data.totalPayment === undefined) {
        result.data.totalPayment =
          (result.data.totalItemCost || 0) +
          (result.data.totalShippingFee || 0) -
          (result.data.totalVoucherDiscount || 0)
      }
    }

    return {
      message: this.i18n.t('order.order.success.GET_DETAIL_SUCCESS'),
      data: result.data
    }
  }

  async calculate(user: AccessTokenPayload, body: any) {
    const result = await this.pricingService.tinhTamTinhDonHang(user, {
      shops: body.shops,
      platformDiscountCodes: body.platformDiscountCodes
    })

    return {
      message: this.i18n.t('order.order.success.CALCULATE_SUCCESS'),
      data: result
    }
  }

  /* English content normalized from the original source text. */
  private async updateCodOrdersStatus(
    orders: Array<{ id: string; shopId: string | null }>,
    shops: Array<{ shopId: string; isCod?: boolean }>
  ) {
    const codOrderIds = orders
      .filter((order) => {
        if (!order.shopId) return false
        const shop = shops.find((s) => s.shopId === order.shopId)
        return shop?.isCod === true
      })
      .map((order) => order.id)

    if (codOrderIds.length > 0) {
      await this.orderRepo.updateMultipleOrdersStatus(codOrderIds, 'PENDING_PACKAGING')
    }
  }

  /* English content normalized from the original source text. */
  private updateCodOrdersInResponse(
    originalResult: { paymentId: number; orders: any[] },
    shops: Array<{ shopId: string; isCod?: boolean }>
  ) {
    const updatedOrders = originalResult.orders.map((order) => {
      if (!order.shopId) return order

      const shop = shops.find((s) => s.shopId === order.shopId)
      if (shop?.isCod === true) {
        return {
          ...order,
          status: 'PENDING_PACKAGING',
          updatedAt: new Date().toISOString()
        }
      }

      return order
    })

    return {
      paymentId: originalResult.paymentId,
      orders: updatedOrders
    }
  }
}
