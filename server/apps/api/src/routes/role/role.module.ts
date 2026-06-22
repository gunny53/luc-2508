import { Module } from '@nestjs/common'
import { RoleController } from '@routes/role/role.controller'
import { RoleRepo } from '@routes/role/role.repo'
import { RoleService } from '@routes/role/role.service'

@Module({
  providers: [RoleService, RoleRepo],
  controllers: [RoleController],
  exports: [RoleService]
})
export class RoleModule {}
