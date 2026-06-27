'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SocialIcon } from '@/components/ui/social-icons/social-icon'
import { ModernPaymentIcon } from '@/components/ui/payment-icons/modern-payment-icon'
import { useFooter } from './use-footer'
import { footerLinks, paymentTypes, socialLinks } from './footer-mockdata'

export function Footer() {
  const { mobileMenus, email, setEmail, toggleMobileMenu, handleSubscribe } = useFooter()

  return (
    <footer className="bg-white border-t text-sm">
      <div className="border-b bg-gray-50/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left max-w-md">
              <h3 className="text-lg font-bold mb-1">ECSite</h3>
              <p className="text-gray-600 text-sm">
                ECSite
                <span className="font-medium text-primary">voucher 50K</span>ECSite
              </p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto md:mx-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ECSite"
                  className="flex-1 min-w-[350px] px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 bg-white"
                />
                <button
                  onClick={handleSubscribe}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  ECSite
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 xl:gap-x-8 gap-y-6 justify-between">
            {footerLinks.map((section) => (
              <div key={section.title} className="flex-1 min-w-[200px]">
                <div className="hidden md:block">
                  <h3 className="font-medium mb-4 text-gray-900">{section.title}</h3>
                  <ul className="space-y-2.5">
                    {section.links.map((link) => (
                      <li key={link.text}>
                        <Link href={link.href} className="text-gray-500 hover:text-primary transition-colors">
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:hidden">
                  <button
                    onClick={() => toggleMobileMenu(section.title)}
                    className="flex items-center justify-between w-full py-2"
                  >
                    <span className="font-medium text-gray-900">{section.title}</span>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-gray-500 transition-transform duration-200',
                        mobileMenus.includes(section.title) && 'rotate-180'
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-200',
                      mobileMenus.includes(section.title) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    )}
                  >
                    <div className="overflow-hidden">
                      <ul className="space-y-2 py-2">
                        {section.links.map((link) => (
                          <li key={link.text}>
                            <Link href={link.href} className="text-gray-500 hover:text-primary transition-colors block">
                              {link.text}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t bg-gray-50/50">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-center sm:text-left sm:flex-1">
              <h3 className="font-medium mb-4 text-gray-900 text-base">
                ECSite
              </h3>
              <div className="inline-flex flex-wrap justify-center sm:justify-start gap-3">
                {paymentTypes.map((type) => (
                  <ModernPaymentIcon key={type} type={type} size={44} className="w-14 h-9 sm:w-[72px] sm:h-11" />
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">ECSite</p>
            </div>

            <div className="text-center sm:text-left">
              <h3 className="font-medium mb-4 text-gray-900 text-base">
                ECSite
              </h3>
              <div className="inline-flex items-center justify-center sm:justify-start gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.type}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'w-11 h-11 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:scale-105 hover:shadow-md transition-all duration-300 group relative overflow-hidden',
                      social.colorClass
                    )}
                  >
                    <SocialIcon type={social.type} size={24} className={cn('relative z-10', social.textColor)} />
                    <div className="absolute inset-0 bg-gradient-to-r from-current/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">ECSite</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} ECSite
            <br />
            <span className="mt-1 block">ECSite</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
