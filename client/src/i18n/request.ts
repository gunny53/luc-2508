import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value || 'vi'
  const locale = ['vi', 'en'].includes(cookieLocale) ? cookieLocale : 'vi'

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'Asia/Ho_Chi_Minh',
    skipInspection: true,
    defaultLocale: 'vi',
    onError: (error) => {
      if (error.code === 'ENVIRONMENT_FALLBACK') {
        return
      }

      console.warn('i18n warning:', error.message)
    },
    getMessageFallback: ({ namespace, key }) => {
      return namespace ? `${namespace}.${key}` : key
    }
  }
})
