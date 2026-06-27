import { PaymentType, PAYMENT_TYPES } from '@/types/payment.interface'
import { SocialType } from '@/components/ui/social-icons/social-icon'


export type FooterLink = {
  text: string
  href: string
}

export type FooterSection = {
  title: string
  links: FooterLink[]
}

export type SocialLink = {
  type: SocialType
  href: string
  colorClass: string
  textColor: string
}


export const footerLinks: FooterSection[] = [
  {
    title: 'ECSite',
    links: [
      { text: 'ECSite', href: '/about' },
      { text: 'Blog', href: '/blog' },
      { text: 'ECSite Careers', href: '/careers' },
      { text: 'ECSite', href: '/jobs' },
      { text: 'ECSite', href: '/privacy' },
      { text: 'ECSite', href: '/terms' }
    ]
  },
  {
    title: 'ECSite',
    links: [
      { text: 'ECSite', href: '/support' },
      { text: 'ECSite', href: '/shipping' },
      { text: 'ECSite', href: '/returns' },
      { text: 'ECSite', href: '/payment' },
      { text: 'ECSite', href: '/contact' },
      { text: 'ECSite', href: '/report' }
    ]
  },
  {
    title: 'ECSite',
    links: [
      { text: 'ECSite', href: '/shipping-policy' },
      { text: 'ECSite', href: '/return-policy' },
      { text: 'ECSite', href: '/refund-policy' },
      { text: 'ECSite', href: '/track-order' },
      { text: 'ECSite', href: '/shipping-fees' },
      { text: 'ECSite', href: '/complaints' }
    ]
  },
  {
    title: 'ECSite',
    links: [
      { text: 'ECSite', href: '/seller' },
      { text: 'Affiliate Program', href: '/affiliate' },
      { text: 'ECSite', href: '/promotions' },
      { text: 'ECSite', href: '/referral' },
      { text: 'ECSite', href: '/logistics' },
      { text: 'ECSite', href: '/wholesale' }
    ]
  }
]

export const paymentTypes: PaymentType[] = [
  PAYMENT_TYPES.VISA,
  PAYMENT_TYPES.MASTERCARD,
  PAYMENT_TYPES.JCB,
  PAYMENT_TYPES.UNIONPAY,
  PAYMENT_TYPES.MOMO
]

export const socialLinks: SocialLink[] = [
  { type: 'facebook', href: '#', colorClass: 'hover:border-[#1877F2]/30', textColor: 'text-[#1877F2]' },
  { type: 'instagram', href: '#', colorClass: 'hover:border-[#E4405F]/30', textColor: 'text-[#E4405F]' },
  { type: 'youtube', href: '#', colorClass: 'hover:border-[#FF0000]/30', textColor: 'text-[#FF0000]' },
  {
    type: 'mail',
    href: 'mailto:support@ecsite.com',
    colorClass: 'hover:border-[#EA4335]/30',
    textColor: 'text-[#EA4335]'
  }
]
