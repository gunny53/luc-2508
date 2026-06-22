import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreatePermissionBodyDTO,
  GetPermissionDetailResDTO,
  GetPermissionParamsDTO,
  GetPermissionsQueryDTO,
  GetPermissionsResDTO,
  UpdatePermissionBodyDTO
} from '@routes/permission/permission.dto'
import { PermissionService } from '@routes/permission/permission.service'
import { ActiveUser } from '@shared/decorators/active-user.decorator'
import { MessageResDTO } from '@shared/dtos/response.dto'
import { AccessTokenPayload } from '@shared/types/jwt.type'

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ZodSerializerDto(GetPermissionsResDTO)
  list(@Query() query: GetPermissionsQueryDTO) {
    return this.permissionService.list({ page: query.page, limit: query.limit })
  }

  @Get(':permissionId')
  @ZodSerializerDto(GetPermissionDetailResDTO)
  findById(@Param() params: GetPermissionParamsDTO) {
    return this.permissionService.findById(params.permissionId)
  }

  @Post()
  @ZodSerializerDto(GetPermissionDetailResDTO)
  create(@Body() body: CreatePermissionBodyDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.permissionService.create({ data: body, user } as any)
  }

  @Put(':permissionId')
  @ZodSerializerDto(GetPermissionDetailResDTO)
  update(
    @Body() body: UpdatePermissionBodyDTO,
    @Param() params: GetPermissionParamsDTO,
    @ActiveUser() user: AccessTokenPayload
  ) {
    return this.permissionService.update({ data: body, id: params.permissionId, user } as any)
  }

  @Delete(':permissionId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetPermissionParamsDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.permissionService.delete({ id: params.permissionId, user } as any)
  }
}
