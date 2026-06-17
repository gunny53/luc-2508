import { Logger, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { ZodSerializationException } from 'nestjs-zod'
import { I18nService } from 'nestjs-i18n'
import { I18nTranslations } from 'src/shared/languages/generated/i18n.generated'
import { Response } from 'express'

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
    const exceptionResponse = exception.getResponse() as any

    // English content normalized from the original source text.
    const lang = request.headers['accept-language'] || request.query.lang || 'en'
    const language = Array.isArray(lang) ? lang[0] : lang

    // English content normalized from the original source text.
    if (exceptionResponse.message) {
      try {
        let translatedMessage: any

        // English content normalized from the original source text.
        if (typeof exceptionResponse.message === 'string') {
          const messageKey = exceptionResponse.message

          // English content normalized from the original source text.
          if (messageKey.includes('.')) {
            translatedMessage = await this.i18n.translate(messageKey as keyof I18nTranslations, { lang: language })
          } else {
            translatedMessage = messageKey
          }
        }
        // English content normalized from the original source text.
        else if (Array.isArray(exceptionResponse.message)) {
          translatedMessage = await Promise.all(
            exceptionResponse.message.map(async (error: any) => ({
              ...error,
              message:
                typeof error.message === 'string' && error.message.includes('.')
                  ? await this.i18n.translate(error.message as keyof I18nTranslations, { lang: language })
                  : error.message
            }))
          )
        }
        // English content normalized from the original source text.
        else {
          translatedMessage = exceptionResponse.message
        }

        // English content normalized from the original source text.
        const errorResponse = {
          message: translatedMessage,
          error: exceptionResponse.error || exception.message,
          statusCode: status
        }

        return response.status(status).json(errorResponse)
      } catch (translateError) {
        this.logger.warn(`Failed to translate message: ${JSON.stringify(exceptionResponse.message)}`, translateError)
        // English content normalized from the original source text.
      }
    }

    super.catch(exception, host)
  }
}
