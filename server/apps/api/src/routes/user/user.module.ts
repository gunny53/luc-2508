import { Module } from '@nestjs/common'
import { UserController } from '@routes/user/user.controller'
import { UserRepo } from '@routes/user/user.repo'
import { UserService } from '@routes/user/user.service'

@Module({
  providers: [UserService, UserRepo],
  controllers: [UserController]
})
export class UserModule {}
