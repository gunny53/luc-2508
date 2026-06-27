import { Injectable, ForbiddenException } from '@nestjs/common'
import { OrderRepo } from '../order.repo'
import { I18nService } from 'nestjs-i18n'
import { I18nTranslations } from '@shared/languages/generated/i18n.generated'
import { AccessTokenPayload } from '@shared/types/jwt.type'
import { GetManageOrderListQueryType, GetManageOrderDetailResType } from '../order.model'

@Injectable()
export class ManageOrderService {
  constructor(
    private readonly orderRepo: OrderRepo,
    private readonly i18n: I18nService<I18nTranslations>
  ) {}

  validateSellerPrivilege(user: AccessTokenPayload): boolean {
    if (user.roleName !== 'SELLER' && user.roleName !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to access this order.')
    }
    return true
  }

  async list({ query, user }: { query: GetManageOrderListQueryType; user: AccessTokenPayload }) {
    this.validateSellerPrivilege(user)

    let data
    if (user.roleName === 'ADMIN') {
      data = await this.orderRepo.listForAdmin(query)
    } else {
      data = await this.orderRepo.listByShop(user.userId, query)
    }

    return {
      message: this.i18n.t('order.order.success.GET_SUCCESS'),
      data: data.data,
      metadata: data.metadata
    }
  }

  async getDetail({
    orderId,
    user
  }: {
    orderId: string
    user: AccessTokenPayload
  }): Promise<GetManageOrderDetailResType> {
    this.validateSellerPrivilege(user)

    let order
    if (user.roleName === 'ADMIN') {
      order = await this.orderRepo.detailForAdmin(orderId)
    } else {
      order = await this.orderRepo.detailByShop(user.userId, orderId)
    }

    if (!order) {
      throw new Error('Order not found')
    }

    return {
      message: this.i18n.t('order.order.success.GET_DETAIL_SUCCESS'),
      data: order.data
    }
  }
}
