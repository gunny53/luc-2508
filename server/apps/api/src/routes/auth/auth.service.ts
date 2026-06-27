import { HttpException, Injectable } from '@nestjs/common'
import { addMilliseconds } from 'date-fns'
import {
  DisableTwoFactorBodyType,
  ForgotPasswordBodyType,
  LoginBodyType,
  RegisterBodyType,
  SendOTPBodyType
} from '@routes/auth/auth.model'
import { AuthRepository } from '@routes/auth/auth.repo'
import { generateOTP, isNotFoundPrismaError, isUniqueConstraintPrismaError } from '@shared/helpers'
import { SharedUserRepository } from '@shared/repositories/shared-user.repo'
import { HashingService } from '@shared/services/hashing.service'
import { TokenService } from '@shared/services/token.service'
import ms from 'ms'
import { TypeOfVerificationCode, TypeOfVerificationCodeType } from '@shared/constants/auth.constant'
import { EmailService } from '@shared/services/email.service'
import { AccessTokenPayloadCreate } from '@shared/types/jwt.type'
import {
  EmailAlreadyExistsException,
  EmailNotFoundException,
  FailedToSendOTPException,
  InvalidOTPException,
  InvalidTOTPAndCodeException,
  InvalidTOTPException,
  OTPExpiredException,
  RefreshTokenAlreadyUsedException,
  TOTPAlreadyEnabledException,
  TOTPNotEnabledException,
  UnauthorizedAccessException
} from '@routes/auth/auth.error'
import { TwoFactorService } from '@shared/services/2fa.service'
import { InvalidPasswordException } from '@shared/error'
import { SharedRoleRepository } from '@shared/repositories/shared-role.repo'
import { ConfigService } from '@nestjs/config'
import { CookieService } from '@shared/services/cookie.service'
import { Response } from 'express'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly sharedRoleRepository: SharedRoleRepository,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    private readonly twoFactorService: TwoFactorService,
    private readonly configService: ConfigService,
    private readonly cookieService: CookieService
  ) {}

  async validateVerificationCode({ email, type }: { email: string; type: TypeOfVerificationCodeType }) {
    const vevificationCode = await this.authRepository.findUniqueVerificationCode({
      email_type: {
        email,
        type
      }
    })
    if (!vevificationCode) {
      throw InvalidOTPException
    }
    if (vevificationCode.expiresAt < new Date()) {
      throw OTPExpiredException
    }
    return vevificationCode
  }
  async register(body: RegisterBodyType) {
    try {
      await this.validateVerificationCode({
        email: body.email,
        type: TypeOfVerificationCode.REGISTER
      })
      const clientRoleId = await this.sharedRoleRepository.getClientRoleId()
      const hashedPassword = await this.hashingService.hash(body.password)
      const [user] = await Promise.all([
        this.authRepository.createUser({
          email: body.email,
          name: body.name,
          phoneNumber: body.phoneNumber,
          password: hashedPassword,
          roleId: clientRoleId
        }),
        this.authRepository.deleteVerificationCode({
          email_type: {
            email: body.email,
            type: TypeOfVerificationCode.REGISTER
          }
        })
      ])
      return user
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw EmailAlreadyExistsException
      }
      throw error
    }
  }

  async sendOTP(body: SendOTPBodyType) {
    const user = await this.sharedUserRepository.findUnique({
      email: body.email
    })
    if (body.type === TypeOfVerificationCode.REGISTER && user) {
      throw EmailAlreadyExistsException
    }
    if (body.type === TypeOfVerificationCode.FORGOT_PASSWORD && !user) {
      throw EmailNotFoundException
    }
    const code = generateOTP()
    await this.authRepository.createVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(this.configService.get('auth.otp.expiresIn') as ms.StringValue))
    })
    const { error } = await this.emailService.sendOTP({
      email: body.email,
      code
    })
    if (error) {
      throw FailedToSendOTPException
    }
    return { message: 'OTP sent successfully.' }
  }

  async login(body: LoginBodyType & { userAgent: string; ip: string }, res: Response) {
    const user = await this.authRepository.findUniqueUserIncludeRole({
      email: body.email
    })
    if (!user) {
      throw EmailNotFoundException
    }

    const isPasswordMatch = await this.hashingService.compare(body.password, user.password)
    if (!isPasswordMatch) {
      throw InvalidPasswordException
    }
    if (user.totpSecret) {
      if (!body.totpCode && !body.code) {
        throw InvalidTOTPAndCodeException
      }
      if (body.totpCode) {
        const isValid = this.twoFactorService.verifyTOTP({
          email: user.email,
          secret: user.totpSecret,
          token: body.totpCode
        })
        if (!isValid) {
          throw InvalidTOTPException
        }
      } else if (body.code) {
        await this.validateVerificationCode({
          email: user.email,
          type: TypeOfVerificationCode.LOGIN
        })
      }
    }
    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent: body.userAgent,
      ip: body.ip
    })
    const tokens = await this.generateTokens({
      userId: user.id,
      deviceId: device.id,
      roleId: user.roleId,
      roleName: user.role.name
    })

    this.cookieService.setAuthCookies(res, tokens.accessToken, tokens.refreshToken)

    return { message: 'Login successful.' }
  }

  async generateTokens({ userId, deviceId, roleId, roleName }: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        userId,
        deviceId,
        roleId,
        roleName
      }),
      this.tokenService.signRefreshToken({
        userId
      })
    ])
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.authRepository.createRefreshToken({
      token: refreshToken,
      userId,
      expiresAt: new Date(decodedRefreshToken.exp * 1000),
      deviceId
    })
    return { accessToken, refreshToken }
  }

  async refreshToken({
    refreshToken,
    userAgent,
    ip,
    res
  }: {
    refreshToken: string
    userAgent: string
    ip: string
    res: Response
  }) {
    try {
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)
      const refreshTokenInDb = await this.authRepository.findUniqueRefreshTokenIncludeUserRole({
        token: refreshToken
      })
      if (!refreshTokenInDb) {
        throw RefreshTokenAlreadyUsedException
      }
      const {
        deviceId,
        user: {
          roleId,
          role: { name: roleName }
        }
      } = refreshTokenInDb
      const $updateDevice = this.authRepository.updateDevice(deviceId, {
        ip,
        userAgent
      })
      const $deleteRefreshToken = this.authRepository.deleteRefreshToken({
        token: refreshToken
      })
      const $tokens = this.generateTokens({ userId, roleId, roleName, deviceId })
      const [, , tokens] = await Promise.all([$updateDevice, $deleteRefreshToken, $tokens])
      this.cookieService.setAuthCookies(res, tokens.accessToken, tokens.refreshToken)
      return { message: 'Token refreshed successfully.' }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw UnauthorizedAccessException
    }
  }

  async logout(refreshToken: string) {
    try {
      await this.tokenService.verifyRefreshToken(refreshToken)
      const deletedRefreshToken = await this.authRepository.deleteRefreshToken({
        token: refreshToken
      })
      await this.authRepository.updateDevice(deletedRefreshToken.deviceId, {
        isActive: false
      })
      return { message: 'Logged out successfully.' }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw RefreshTokenAlreadyUsedException
      }
      throw UnauthorizedAccessException
    }
  }

  async forgotPassword(body: ForgotPasswordBodyType) {
    const { email, newPassword } = body
    const user = await this.sharedUserRepository.findUnique({
      email
    })
    if (!user) {
      throw EmailNotFoundException
    }
    await this.validateVerificationCode({
      email,
      type: TypeOfVerificationCode.FORGOT_PASSWORD
    })
    const hashedPassword = await this.hashingService.hash(newPassword)
    await Promise.all([
      this.sharedUserRepository.update(
        { id: user.id },
        {
          password: hashedPassword,
          updatedById: user.id
        }
      ),
      this.authRepository.deleteVerificationCode({
        email_type: {
          email: body.email,
          type: TypeOfVerificationCode.FORGOT_PASSWORD
        }
      })
    ])
    return {
      message: 'Password reset successfully.'
    }
  }

  async setupTwoFactorAuth(userId: string) {
    const user = await this.sharedUserRepository.findUnique({
      id: userId
    })
    if (!user) {
      throw EmailNotFoundException
    }
    if (user.totpSecret) {
      throw TOTPAlreadyEnabledException
    }
    const { secret, uri } = this.twoFactorService.generateTOTPSecret(user.email)
    await this.sharedUserRepository.update({ id: userId }, { totpSecret: secret, updatedById: userId })
    return {
      secret,
      uri
    }
  }

  async disableTwoFactorAuth(data: DisableTwoFactorBodyType & { userId: string }) {
    const { userId, totpCode, code } = data
    const user = await this.sharedUserRepository.findUnique({ id: userId })
    if (!user) {
      throw EmailNotFoundException
    }
    if (!user.totpSecret) {
      throw TOTPNotEnabledException
    }
    if (totpCode) {
      const isValid = this.twoFactorService.verifyTOTP({
        email: user.email,
        secret: user.totpSecret,
        token: totpCode
      })
      if (!isValid) {
        throw InvalidTOTPException
      }
    } else if (code) {
      await this.validateVerificationCode({
        email: user.email,
        type: TypeOfVerificationCode.DISABLE_2FA
      })
    }
    await this.sharedUserRepository.update({ id: userId }, { totpSecret: null, updatedById: userId })
    return {
      message: 'Two-factor authentication disabled successfully.'
    }
  }
}
