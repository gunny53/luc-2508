import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PrismaService } from '@shared/services/prisma.service'
import { DiscountStatus } from '@shared/constants/discount.constant'

@Injectable()
export class ExpireDiscountCronjob {
  private readonly logger = new Logger(ExpireDiscountCronjob.name)

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleExpireDiscounts() {
    const now = new Date()
    const result = await this.prisma.discount.updateMany({
      where: {
        endDate: { lt: now },
        discountStatus: DiscountStatus.ACTIVE
      },
      data: { discountStatus: DiscountStatus.EXPIRED }
    })
    if (result.count > 0) {
      this.logger.log(
        `English content normalized from the original source text.${result.count}English content normalized from the original source text.`
      )
    }
  }
}
