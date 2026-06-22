import { Body, Controller, Get, HttpCode, HttpStatus, Ip, Post, Query, Res, Req } from '@nestjs/common'
import { Response, Request } from 'express'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  DisableTwoFactorBodyDTO,
  ForgotPasswordBodyDTO,
  GetAuthorizationUrlResDTO,
  LoginBodyDTO,
  RegisterBodyDTO,
  RegisterResDTO,
  SendOTPBodyDTO,
  TwoFactorSetupResDTO
} from '@routes/auth/auth.dto'

import { AuthService } from '@routes/auth/auth.service'
import { GoogleService } from '@routes/auth/google.service'
import { ActiveUser } from '@shared/decorators/active-user.decorator'
import { IsPublic } from '@shared/decorators/auth.decorator'
import { UserAgent } from '@shared/decorators/user-agent.decorator'
import { EmptyBodyDTO } from '@shared/dtos/request.dto'
import { MessageResDTO } from '@shared/dtos/response.dto'
import { ConfigService } from '@nestjs/config'
import { CookieService } from '@shared/services/cookie.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService,
    private readonly configService: ConfigService,
    private readonly cookieService: CookieService
  ) {}

  @Post('register')
  @IsPublic()
  @ZodSerializerDto(RegisterResDTO)
  register(@Body() body: RegisterBodyDTO) {
    return this.authService.register(body as any)
  }

  @Post('otp')
  @IsPublic()
  @ZodSerializerDto(MessageResDTO)
  sendOTP(@Body() body: SendOTPBodyDTO) {
    return this.authService.sendOTP(body as any)
  }

  @Post('login')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(MessageResDTO)
  async login(
    @Body() body: LoginBodyDTO,
    @UserAgent() userAgent: string,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.login(
      {
        ...body,
        userAgent,
        ip
      } as any,
      res
    )
  }

  @Post('refresh-token')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(MessageResDTO)
  refreshToken(
    @Req() req: Request,
    @UserAgent() userAgent: string,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = req.cookies?.refresh_token
    return this.authService.refreshToken({
      refreshToken,
      userAgent,
      ip,
      res
    })
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(MessageResDTO)
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token
    this.cookieService.clearAuthCookies(res)
    return this.authService.logout(refreshToken)
  }

  @Get('google-link')
  @IsPublic()
  @ZodSerializerDto(GetAuthorizationUrlResDTO)
  getAuthorizationUrl(@UserAgent() userAgent: string, @Ip() ip: string) {
    return this.googleService.getAuthorizationUrl({
      userAgent,
      ip
    })
  }

  @Get('google/callback')
  @IsPublic()
  async googleCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
    try {
      await this.googleService.googleCallback({
        code,
        state,
        res
      })
      const redirectUrl = this.configService.get('auth.google.client.redirectUri')
      return res.redirect(redirectUrl)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'English content normalized from the original source text.'
      const redirectUrl = this.configService.get('auth.google.client.redirectUri')
      return res.redirect(`${redirectUrl}?errorMessage=${encodeURIComponent(message)}`)
    }
  }

  @Post('forgot-password')
  @IsPublic()
  @ZodSerializerDto(MessageResDTO)
  forgotPassword(@Body() body: ForgotPasswordBodyDTO) {
    return this.authService.forgotPassword(body as any)
  }
  @Post('2fa/setup')
  @ZodSerializerDto(TwoFactorSetupResDTO)
  setupTwoFactorAuth(@Body() _: EmptyBodyDTO, @ActiveUser('userId') userId: string) {
    return this.authService.setupTwoFactorAuth(userId)
  }

  @Post('2fa/disable')
  @ZodSerializerDto(MessageResDTO)
  disableTwoFactorAuth(@Body() body: DisableTwoFactorBodyDTO, @ActiveUser('userId') userId: string) {
    return this.authService.disableTwoFactorAuth({
      ...body,
      userId
    })
  }
}
