'use client'

import { NextIntlClientProvider } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'
import type { ReactNode } from 'react'

interface IntlClientProviderProps {
  children: ReactNode
  locale: string
  messages: AbstractIntlMessages
  timeZone: string
}

export default function IntlClientProvider({ children, locale, messages, timeZone }: IntlClientProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
      {children}
    </NextIntlClientProvider>
  )
}
