import { PaymentType, PAYMENT_TYPES } from '@/types/payment.interface'
import { SocialType } from '@/components/ui/social-icons/social-icon'

export type FooterLink = {
  textKey: string
  href: string
}

export type FooterSection = {
  titleKey: string
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
    titleKey: 'sections.about.title',
    links: [
      { textKey: 'sections.about.links.intro', href: '/about' },
      { textKey: 'sections.about.links.blog', href: '/blog' },
      { textKey: 'sections.about.links.careers', href: '/careers' },
      { textKey: 'sections.about.links.jobs', href: '/jobs' },
      { textKey: 'sections.about.links.privacy', href: '/privacy' },
      { textKey: 'sections.about.links.terms', href: '/terms' }
    ]
  },
  {
    titleKey: 'sections.support.title',
    links: [
      { textKey: 'sections.support.links.helpCenter', href: '/support' },
      { textKey: 'sections.support.links.shippingGuide', href: '/shipping' },
      { textKey: 'sections.support.links.returns', href: '/returns' },
      { textKey: 'sections.support.links.payment', href: '/payment' },
      { textKey: 'sections.support.links.contact', href: '/contact' },
      { textKey: 'sections.support.links.report', href: '/report' }
    ]
  },
  {
    titleKey: 'sections.policy.title',
    links: [
      { textKey: 'sections.policy.links.shippingPolicy', href: '/shipping-policy' },
      { textKey: 'sections.policy.links.returnPolicy', href: '/return-policy' },
      { textKey: 'sections.policy.links.refundPolicy', href: '/refund-policy' },
      { textKey: 'sections.policy.links.trackOrder', href: '/track-order' },
      { textKey: 'sections.policy.links.shippingFees', href: '/shipping-fees' },
      { textKey: 'sections.policy.links.complaints', href: '/complaints' }
    ]
  },
  {
    titleKey: 'sections.partner.title',
    links: [
      { textKey: 'sections.partner.links.seller', href: '/seller' },
      { textKey: 'sections.partner.links.affiliate', href: '/affiliate' },
      { textKey: 'sections.partner.links.promotions', href: '/promotions' },
      { textKey: 'sections.partner.links.referral', href: '/referral' },
      { textKey: 'sections.partner.links.logistics', href: '/logistics' },
      { textKey: 'sections.partner.links.wholesale', href: '/wholesale' }
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
