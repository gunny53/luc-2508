import { HttpException, Injectable } from '@nestjs/common'
import { addMilliseconds } from 'date-fns'
import {
  DisableTwoFactorBodyType,
  ForgotPasswordBodyType,
  LoginBodyType,
  RegisterBodyType,
  SendOTPBodyType
} from 'src/routes/auth/auth.model'
import { AuthRepository } from 'src/routes/auth/auth.repo'
import { generateOTP, isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { HashingService } from 'src/shared/services/hashing.service'
import { TokenService } from 'src/shared/services/token.service'
import ms from 'ms'
import { TypeOfVerificationCode, TypeOfVerificationCodeType } from 'src/shared/constants/auth.constant'
import { EmailService } from 'src/shared/services/email.service'
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type'
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
} from 'src/routes/auth/auth.error'
import { TwoFactorService } from 'src/shared/services/2fa.service'
import { InvalidPasswordException } from 'src/shared/error'
import { SharedRoleRepository } from 'src/shared/repositories/shared-role.repo'
import { ConfigService } from '@nestjs/config'
import { CookieService } from 'src/shared/services/cookie.service'
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
    // English content normalized from the original source text.
    const code = generateOTP()
    await this.authRepository.createVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(this.configService.get('auth.otp.expiresIn')))
    })
    // English content normalized from the original source text.
    const { error } = await this.emailService.sendOTP({
      email: body.email,
      code
    })
    if (error) {
      throw FailedToSendOTPException
    }
    return { message: 'English content normalized from the original source text.' }
  }

  async login(body: LoginBodyType & { userAgent: string; ip: string }, res: Response) {
    // English content normalized from the original source text.
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
    // English content normalized from the original source text.
    if (user.totpSecret) {
      // English content normalized from the original source text.
      if (!body.totpCode && !body.code) {
        throw InvalidTOTPAndCodeException
      }

      // English content normalized from the original source text.
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
        // English content normalized from the original source text.
        await this.validateVerificationCode({
          email: user.email,
          type: TypeOfVerificationCode.LOGIN
        })
      }
    }

    // English content normalized from the original source text.
    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent: body.userAgent,
      ip: body.ip
    })

    // English content normalized from the original source text.
    const tokens = await this.generateTokens({
      userId: user.id,
      deviceId: device.id,
      roleId: user.roleId,
      roleName: user.role.name
    })

    this.cookieService.setAuthCookies(res, tokens.accessToken, tokens.refreshToken)

    return { message: 'English content normalized from the original source text.' }
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
      // English content normalized from the original source text.
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)
      // English content normalized from the original source text.
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
      return { message: 'English content normalized from the original source text.' }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw UnauthorizedAccessException
    }
  }

  async logout(refreshToken: string) {
    try {
      // English content normalized from the original source text.
      await this.tokenService.verifyRefreshToken(refreshToken)
      // English content normalized from the original source text.
      const deletedRefreshToken = await this.authRepository.deleteRefreshToken({
        token: refreshToken
      })
      // English content normalized from the original source text.
      await this.authRepository.updateDevice(deletedRefreshToken.deviceId, {
        isActive: false
      })
      return { message: 'English content normalized from the original source text.' }
    } catch (error) {
      // English content normalized from the original source text.
      // English content normalized from the original source text.
      if (isNotFoundPrismaError(error)) {
        throw RefreshTokenAlreadyUsedException
      }
      throw UnauthorizedAccessException
    }
  }

  async forgotPassword(body: ForgotPasswordBodyType) {
    const { email, newPassword } = body
    // English content normalized from the original source text.
    const user = await this.sharedUserRepository.findUnique({
      email
    })
    if (!user) {
      throw EmailNotFoundException
    }
    // English content normalized from the original source text.
    await this.validateVerificationCode({
      email,
      type: TypeOfVerificationCode.FORGOT_PASSWORD
    })
    // English content normalized from the original source text.
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
      message: 'English content normalized from the original source text.'
    }
  }

  async setupTwoFactorAuth(userId: string) {
    // English content normalized from the original source text.
    const user = await this.sharedUserRepository.findUnique({
      id: userId
    })
    if (!user) {
      throw EmailNotFoundException
    }
    if (user.totpSecret) {
      throw TOTPAlreadyEnabledException
    }
    // English content normalized from the original source text.
    const { secret, uri } = this.twoFactorService.generateTOTPSecret(user.email)
    // English content normalized from the original source text.
    await this.sharedUserRepository.update({ id: userId }, { totpSecret: secret, updatedById: userId })
    // English content normalized from the original source text.
    return {
      secret,
      uri
    }
  }

  async disableTwoFactorAuth(data: DisableTwoFactorBodyType & { userId: string }) {
    const { userId, totpCode, code } = data
    // English content normalized from the original source text.
    const user = await this.sharedUserRepository.findUnique({ id: userId })
    if (!user) {
      throw EmailNotFoundException
    }
    if (!user.totpSecret) {
      throw TOTPNotEnabledException
    }

    // English content normalized from the original source text.
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
      // English content normalized from the original source text.
      await this.validateVerificationCode({
        email: user.email,
        type: TypeOfVerificationCode.DISABLE_2FA
      })
    }

    // English content normalized from the original source text.
    await this.sharedUserRepository.update({ id: userId }, { totpSecret: null, updatedById: userId })

    // English content normalized from the original source text.
    return {
      message: 'English content normalized from the original source text.'
    }
  }
}
