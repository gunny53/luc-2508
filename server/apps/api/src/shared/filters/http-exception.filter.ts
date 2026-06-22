import { Logger, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { ZodSerializationException } from 'nestjs-zod'
import { I18nService } from 'nestjs-i18n'
import { I18nTranslations } from '@shared/languages/generated/i18n.generated'
import { Response } from 'express'

interface HttpExceptionResponseBody {
  message?: string | ValidationErrorResponse[]
  error?: string
}

interface ValidationErrorResponse {
  message?: string
  [key: string]: string | undefined
}

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  constructor(private readonly i18n: I18nService<I18nTranslations>) {
    super()
  }

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest()

    if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError()
      this.logger.error(`ZodSerializationException: ${zodError.message}`)
    }

    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse() as HttpExceptionResponseBody
    const lang = request.headers['accept-language'] || request.query.lang || 'en'
    const language = Array.isArray(lang) ? lang[0] : lang
    if (exceptionResponse.message) {
      try {
        let translatedMessage: string | ValidationErrorResponse[] | undefined
        if (typeof exceptionResponse.message === 'string') {
          const messageKey = exceptionResponse.message
          if (messageKey.includes('.')) {
            translatedMessage = String(await this.i18n.translate(messageKey, { lang: language }))
          } else {
            translatedMessage = messageKey
          }
        } else if (Array.isArray(exceptionResponse.message)) {
          translatedMessage = await Promise.all(
            exceptionResponse.message.map(async (error) => ({
              ...error,
              message:
                typeof error.message === 'string' && error.message.includes('.')
                  ? String(await this.i18n.translate(error.message, { lang: language }))
                  : error.message
            }))
          )
        } else {
          translatedMessage = exceptionResponse.message
        }
        const errorResponse = {
          message: translatedMessage,
          error: exceptionResponse.error || exception.message,
          statusCode: status
        }

        return response.status(status).json(errorResponse)
      } catch (translateError) {
        this.logger.warn(`Failed to translate message: ${JSON.stringify(exceptionResponse.message)}`, translateError)
      }
    }

    super.catch(exception, host)
  }
}
