import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import {
  CreateReviewBodyType,
  CreateReviewResType,
  GetReviewsType,
  UpdateReviewBodyType,
  UpdateReviewResType
} from 'src/routes/review/review.model'
import { OrderStatus } from 'src/shared/constants/order.constant'
import { isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { PaginationQueryType } from 'src/shared/models/request.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class ReviewRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(productId: string, pagination: PaginationQueryType): Promise<GetReviewsType> {
    const skip = (pagination.page - 1) * pagination.limit
    const take = pagination.limit

    const [totalItems, data] = await Promise.all([
      this.prismaService.review.count({
        where: {
          productId
        }
      }),
      this.prismaService.review.findMany({
        where: {
          productId
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          medias: true
        },
        skip,
        take,
        orderBy: {
          createdAt: 'desc'
        }
      })
    ])
    return {
      data: data.map((review) => ({ data: review })),
      metadata: {
        totalItems,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(totalItems / pagination.limit),
        hasNext: pagination.page < Math.ceil(totalItems / pagination.limit),
        hasPrev: pagination.page > 1
      }
    }
  }

  private async validateOrder({ orderId, userId }: { orderId: string; userId: string }) {
    const order = await this.prismaService.order.findUnique({
      where: {
        id: orderId,
        userId
      }
    })
    // English content normalized from the original source text.
    if (!order) {
      throw new BadRequestException('English content normalized from the original source text.')
    }

    // English content normalized from the original source text.
    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('English content normalized from the original source text.')
    }
    return order
  }

  private async validateUpdateReview({ reviewId, userId }: { reviewId: string; userId: string }) {
    const review = await this.prismaService.review.findUnique({
      where: {
        id: reviewId,
        userId
      }
    })
    if (!review) {
      throw new NotFoundException('English content normalized from the original source text.')
    }
    if (review.updateCount >= 1) {
      throw new BadRequestException('English content normalized from the original source text.')
    }
    return review
  }

  async create(userId: string, body: CreateReviewBodyType): Promise<CreateReviewResType> {
    const { content, medias, productId, orderId, rating } = body
    await this.validateOrder({
      orderId,
      userId
    })
    return this.prismaService.$transaction(async (tx) => {
      const review = await tx.review
        .create({
          data: {
            content,
            rating,
            productId,
            orderId,
            userId
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        })
        .catch((error) => {
          if (isUniqueConstraintPrismaError(error)) {
            throw new ConflictException('English content normalized from the original source text.')
          }
          throw error
        })
      const reviewMedias = await tx.reviewMedia.createManyAndReturn({
        data: medias.map((media) => ({
          url: media.url,
          type: media.type,
          reviewId: review.id
        }))
      })
      return {
        data: {
          ...review,
          medias: reviewMedias
        }
      }
    })
  }

  async update({
    userId,
    reviewId,
    body
  }: {
    userId: string
    reviewId: string
    body: UpdateReviewBodyType
  }): Promise<UpdateReviewResType> {
    const { content, medias, productId, orderId, rating } = body
    await Promise.all([
      this.validateOrder({
        orderId,
        userId
      }),
      this.validateUpdateReview({
        reviewId,
        userId
      })
    ])
    return this.prismaService.$transaction(async (tx) => {
      const review = await tx.review.update({
        where: {
          id: reviewId
        },
        data: {
          content,
          rating,
          productId,
          orderId,
          userId,
          updateCount: {
            increment: 1
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      })

      await tx.reviewMedia.deleteMany({
        where: {
          reviewId
        }
      })
      const reviewMedias = await tx.reviewMedia.createManyAndReturn({
        data: medias.map((media) => ({
          url: media.url,
          type: media.type,
          reviewId: review.id
        }))
      })
      return {
        data: {
          ...review,
          medias: reviewMedias
        }
      }
    })
  }
}
