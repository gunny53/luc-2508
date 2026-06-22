import { Module } from '@nestjs/common'
import { PermissionController } from '@routes/permission/permission.controller'
import { PermissionRepo } from '@routes/permission/permission.repo'
import { PermissionService } from '@routes/permission/permission.service'

@Module({
  providers: [PermissionService, PermissionRepo],
  controllers: [PermissionController]
})
export class PermissionModule {}
