import CheckoutMainWrapper from '@/components/client/checkout/checkout-wrapper'

interface CheckoutPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug } = await params
  const cartItemIds = slug ? slug.split(',').filter(Boolean) : []

  console.log('🛒 Checkout Page - CartItemIds from URL:', {
    rawSlug: slug,
    cartItemIds,
    count: cartItemIds.length
  })

  return <CheckoutMainWrapper cartItemIds={cartItemIds} />
}
