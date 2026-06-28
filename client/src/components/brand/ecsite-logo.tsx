import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

type ECSiteLogoProps = {
  href?: string
  variant?: 'light' | 'orange'
  className?: string
  iconClassName?: string
  textClassName?: string
}

export function ECSiteLogo({
  href = '/',
  variant = 'orange',
  className,
  iconClassName,
  textClassName
}: ECSiteLogoProps) {
  const isLight = variant === 'light'

  return (
    <Link href={href} className={cn('flex items-center gap-2 font-extrabold tracking-normal', className)}>
      <span
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-lg',
          isLight ? 'bg-white/15 text-white' : 'bg-orange-50 text-primary',
          iconClassName
        )}
      >
        <ShoppingCart className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <span className={cn('text-2xl leading-none', isLight ? 'text-white' : 'text-primary', textClassName)}>
        ECSite
      </span>
    </Link>
  )
}
