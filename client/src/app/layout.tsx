import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import StoreProvider from '@/store/store-provider'
import { Toast } from '@/components/ui/toastify'
import { TrustDeviceModal } from '@/components/auth/layout/trust-device-modal'
import { Toaster } from '@/components/ui/sonner'
import { getLocale, getMessages } from 'next-intl/server'
import { CartProvider } from '@/providers/cart-context'
import { AuthGuard } from '@/components/auth/auth-guard'
import ReactQueryProvider from '@/providers/react-query-provider'
import ChunkErrorHandler from '@/components/client/landing-page/chunkg-error-handler'
import IntlClientProvider from '@/providers/intl-client-provider'

const APP_TIME_ZONE = 'Asia/Ho_Chi_Minh'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'ECSite',
  description: 'ECSite'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`${inter.variable} antialiased`}>
        <IntlClientProvider locale={locale} messages={messages} timeZone={APP_TIME_ZONE}>
          <ReactQueryProvider>
            <StoreProvider>
              <AuthGuard>
                <Toast />
                <TrustDeviceModal />
                <CartProvider>{children}</CartProvider>
              </AuthGuard>
              <Toaster position="bottom-right" />
              <ChunkErrorHandler />
              {}
            </StoreProvider>
          </ReactQueryProvider>
        </IntlClientProvider>
      </body>
    </html>
  )
}
