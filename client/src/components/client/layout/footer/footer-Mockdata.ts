import { PaymentType, PAYMENT_TYPES } from '@/types/payment.interface';
import { SocialType } from '@/components/ui/social-icons/SocialIcon';

// Types
export type FooterLink = {
  text: string;
  href: string;
};

export type FooterSection = {
  title: string;
  links: FooterLink[];
};

export type SocialLink = {
  type: SocialType;
  href: string;
  colorClass: string;
  textColor: string;
};

// Data
export const footerLinks: FooterSection[] = [
  {
    title: 'English content normalized from the original source text.',
    links: [
      { text: 'English content normalized from the original source text.', href: '/about' },
      { text: 'Blog', href: '/blog' },
      { text: 'ECSite Careers', href: '/careers' },
      { text: 'English content normalized from the original source text.', href: '/jobs' },
      { text: 'English content normalized from the original source text.', href: '/privacy' },
      { text: 'English content normalized from the original source text.', href: '/terms' }
    ]
  },
  {
    title: 'English content normalized from the original source text.',
    links: [
      { text: 'English content normalized from the original source text.', href: '/support' },
      { text: 'English content normalized from the original source text.', href: '/shipping' },
      { text: 'English content normalized from the original source text.', href: '/returns' },
      { text: 'English content normalized from the original source text.', href: '/payment' },
      { text: 'English content normalized from the original source text.', href: '/contact' },
      { text: 'English content normalized from the original source text.', href: '/report' }
    ]
  },
  {
    title: 'English content normalized from the original source text.',
    links: [
      { text: 'English content normalized from the original source text.', href: '/shipping-policy' },
      { text: 'English content normalized from the original source text.', href: '/return-policy' },
      { text: 'English content normalized from the original source text.', href: '/refund-policy' },
      { text: 'English content normalized from the original source text.', href: '/track-order' },
      { text: 'English content normalized from the original source text.', href: '/shipping-fees' },
      { text: 'English content normalized from the original source text.', href: '/complaints' }
    ]
  },
  {
    title: 'English content normalized from the original source text.',
    links: [
      { text: 'English content normalized from the original source text.', href: '/seller' },
      { text: 'Affiliate Program', href: '/affiliate' },
      { text: 'English content normalized from the original source text.', href: '/promotions' },
      { text: 'English content normalized from the original source text.', href: '/referral' },
      { text: 'English content normalized from the original source text.', href: '/logistics' },
      { text: 'English content normalized from the original source text.', href: '/wholesale' }
    ]
  }
];

export const paymentTypes: PaymentType[] = [
    PAYMENT_TYPES.VISA,
    PAYMENT_TYPES.MASTERCARD,
    PAYMENT_TYPES.JCB,
    PAYMENT_TYPES.UNIONPAY,
    PAYMENT_TYPES.MOMO,
];

export const socialLinks: SocialLink[] = [
    { type: 'facebook', href: '#', colorClass: 'hover:border-[#1877F2]/30', textColor: 'text-[#1877F2]' },
    { type: 'instagram', href: '#', colorClass: 'hover:border-[#E4405F]/30', textColor: 'text-[#E4405F]' },
    { type: 'youtube', href: '#', colorClass: 'hover:border-[#FF0000]/30', textColor: 'text-[#FF0000]' },
    { type: 'mail', href: 'mailto:support@ecsite.com', colorClass: 'hover:border-[#EA4335]/30', textColor: 'text-[#EA4335]' }
];
