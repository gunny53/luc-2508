import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import StoreProvider from '@/store/store-provider'
import { Toast } from '@/components/ui/toastify'
import { TrustDeviceModal } from '@/components/auth/layout/trust-device-modal'
import { Toaster } from '@/components/ui/sonner'
import { getLocale } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { CartProvider } from '@/providers/cart-context'
import { AuthGuard } from '@/components/auth/auth-guard'
import ReactQueryProvider from '@/providers/react-query-provider'
import ChunkErrorHandler from '@/components/client/landing-page/chunkg-error-handler'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'ECSite',
  description: 'English content normalized from the original source text.'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  return (
    <html lang={locale}>
      <body className={`${inter.variable} antialiased`}>
        <NextIntlClientProvider>
          <ReactQueryProvider>
            <StoreProvider>
              <AuthGuard>
                <Toast />
                <TrustDeviceModal />
                <CartProvider>{children}</CartProvider>
              </AuthGuard>
              <Toaster position="bottom-right" />
              <ChunkErrorHandler />
              {/* </ClientLayout> */}
            </StoreProvider>
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
