import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { google } from 'googleapis'
import { GoogleAuthStateType } from '@routes/auth/auth.model'
import { AuthRepository } from '@routes/auth/auth.repo'
import { AuthService } from '@routes/auth/auth.service'
import { GoogleUserInfoError } from '@routes/auth/auth.error'
import { HashingService } from '@shared/services/hashing.service'
import { v4 as uuidv4 } from 'uuid'
import { SharedRoleRepository } from '@shared/repositories/shared-role.repo'
import { Response } from 'express'
import { CookieService } from '@shared/services/cookie.service'

@Injectable()
export class GoogleService {
  private oauth2Client: ReturnType<GoogleService['createOAuthClient']>
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
    private readonly sharedRoleRepository: SharedRoleRepository,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly cookieService: CookieService
  ) {
    this.oauth2Client = this.createOAuthClient()
  }

  private createOAuthClient() {
    return new google.auth.OAuth2(
      this.configService.get('auth.google.client.id'),
      this.configService.get('auth.google.client.secret'),
      this.configService.get('auth.google.client.redirectUriGoogleCallback')
    )
  }
  getAuthorizationUrl({ userAgent, ip }: GoogleAuthStateType) {
    const scope = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
    const stateString = Buffer.from(
      JSON.stringify({
        userAgent,
        ip
      })
    ).toString('base64')
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope,
      include_granted_scopes: true,
      state: stateString
    })
    return { url }
  }
  async googleCallback({ code, state, res }: { code: string; state: string; res: Response }) {
    try {
      let userAgent = 'Unknown'
      let ip = 'Unknown'
      try {
        if (state) {
          const clientInfo = JSON.parse(Buffer.from(state, 'base64').toString()) as GoogleAuthStateType
          userAgent = clientInfo.userAgent
          ip = clientInfo.ip
        }
      } catch (error) {
        console.error('Error parsing state', error)
      }
      const { tokens } = await this.oauth2Client.getToken(code)
      this.oauth2Client.setCredentials(tokens)
      const oauth2 = google.oauth2({
        auth: this.oauth2Client,
        version: 'v2'
      })
      const { data } = await oauth2.userinfo.get()
      if (!data.email) {
        throw GoogleUserInfoError
      }

      let user = await this.authRepository.findUniqueUserIncludeRole({
        email: data.email
      })
      if (!user) {
        const clientRoleId = await this.sharedRoleRepository.getClientRoleId()
        const randomPassword = uuidv4()
        const hashedPassword = await this.hashingService.hash(randomPassword)
        user = await this.authRepository.createUserInclueRole({
          email: data.email,
          name: data.name ?? '',
          password: hashedPassword,
          roleId: clientRoleId,
          phoneNumber: null,
          avatar: data.picture ?? null
        })
      }
      const device = await this.authRepository.createDevice({
        userId: user.id,
        userAgent,
        ip
      })
      const authTokens = await this.authService.generateTokens({
        userId: user.id,
        deviceId: device.id,
        roleId: user.roleId,
        roleName: user.role.name
      })
      this.cookieService.setAuthCookies(res, authTokens.accessToken, authTokens.refreshToken)

      return { message: 'English content normalized from the original source text.' }
    } catch (error) {
      console.error('Error in googleCallback', error)
      throw error
    }
  }
}
