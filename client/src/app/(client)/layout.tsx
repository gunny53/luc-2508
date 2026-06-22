import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import ReactQueryProvider from '@/providers/react-query-provider'
import { ECSiteSocketProvider } from '@/providers/ec-site-socket-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://ecsite.live/'),
  title: 'English content normalized from the original source text.',
  description: 'English content normalized from the original source text.',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://ecsite.live/',
    siteName: 'ECSite',
    title: 'English content normalized from the original source text.',
    description: 'English content normalized from the original source text.',
    images: [
      {
        url: '/banner_ecsite.png',
        width: 1200,
        height: 630,
        alt: 'English content normalized from the original source text.'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'English content normalized from the original source text.',
    description: 'English content normalized from the original source text.',
    images: ['/banner_ecsite.png']
  },
  keywords: [
    'ECSite',
    'English content normalized from the original source text.',
    'English content normalized from the original source text.',
    'English content normalized from the original source text.',
    'English content normalized from the original source text.',
    'ecommerce',
    'English content normalized from the original source text.'
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
