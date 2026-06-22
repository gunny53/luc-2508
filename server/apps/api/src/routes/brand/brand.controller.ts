import { Body, Controller, Delete, Get, Header, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateBrandBodyDTO,
  GetBrandDetailResDTO,
  GetBrandParamsDTO,
  GetBrandsResDTO,
  UpdateBrandBodyDTO
} from '@routes/brand/brand.dto'
import { BrandService } from '@routes/brand/brand.service'
import { ActiveUser } from '@shared/decorators/active-user.decorator'
import { IsPublic } from '@shared/decorators/auth.decorator'
import { PaginationQueryDTO } from '@shared/dtos/request.dto'
import { MessageResDTO } from '@shared/dtos/response.dto'
import { AccessTokenPayload } from '@shared/types/jwt.type'

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @IsPublic()
  @ZodSerializerDto(GetBrandsResDTO)
  @Header('Cache-Control', 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600')
  @Header('Vary', 'Accept-Language')
  @Header('X-Cache-Strategy', 'redis+cdn+long-term')
  list(@Query() query: PaginationQueryDTO) {
    return this.brandService.list(query as any)
  }

  @Get(':brandId')
  @IsPublic()
  @ZodSerializerDto(GetBrandDetailResDTO)
  @Header('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200')
  @Header('Vary', 'Accept-Language')
  @Header('X-Cache-Strategy', 'redis+cdn+ultra-long')
  findById(@Param() params: GetBrandParamsDTO) {
    return this.brandService.findById(params.brandId)
  }

  @Post()
  @ZodSerializerDto(GetBrandDetailResDTO)
  create(@Body() body: CreateBrandBodyDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.brandService.create({ data: body, user } as any)
  }

  @Put(':brandId')
  @ZodSerializerDto(GetBrandDetailResDTO)
  update(@Body() body: UpdateBrandBodyDTO, @Param() params: GetBrandParamsDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.brandService.update({ data: body, id: params.brandId, user })
  }

  @Delete(':brandId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetBrandParamsDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.brandService.delete({ id: params.brandId, user })
  }
}
