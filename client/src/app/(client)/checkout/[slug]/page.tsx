import CheckoutMainWrapper from "@/components/client/checkout/checkout-Wrapper";

interface CheckoutPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  // English content normalized from the original source text.
  const { slug } = await params;

  // English content normalized from the original source text.
  const cartItemIds = slug ? slug.split(',').filter(Boolean) : [];

  console.log('🛒 Checkout Page - CartItemIds from URL:', {
    rawSlug: slug,
    cartItemIds,
    count: cartItemIds.length
  });

  return (
    <CheckoutMainWrapper cartItemIds={cartItemIds} />
  );
}