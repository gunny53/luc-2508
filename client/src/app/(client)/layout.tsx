import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import ReactQueryProvider from '@/providers/react-query-provider'
import { ECSiteSocketProvider } from '@/providers/ec-site-socket-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://ecsite.live/'),
  title: 'ECSite',
  description: 'ECSite',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://ecsite.live/',
    siteName: 'ECSite',
    title: 'ECSite',
    description: 'ECSite',
    images: [
      {
        url: '/banner_ecsite.png',
        width: 1200,
        height: 630,
        alt: 'ECSite'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ECSite',
    description: 'ECSite',
    images: ['/banner_ecsite.png']
  },
  keywords: [
    'ECSite',
    'ECSite',
    'ECSite',
    'ECSite',
    'ECSite',
    'ecommerce',
    'ECSite'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  alternates: {
    canonical: 'https://ecsite.live/'
  }
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <ECSiteSocketProvider>
        <div className={inter.className}>{children}</div>
      </ECSiteSocketProvider>
    </ReactQueryProvider>
  )
}
