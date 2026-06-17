// src/app/(client)/products/[slug]/page.tsx
import { clientProductsService } from '@/services/clientProductsService';
import ProductPageWrapper from "@/components/client/products/products-Wrapper";
import { extractProductId } from '@/components/client/products/shared/productSlug';
import { Metadata, ResolvingMetadata } from 'next';

// English content normalized from the original source text.
export const revalidate = 300; // English content normalized from the original source text.

interface PageProps {
  params: Promise<{ slug: string }>;
}

// English content normalized from the original source text.
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // English content normalized from the original source text.
  const { slug } = await params;

  try {
    // English content normalized from the original source text.
    const productId = extractProductId(slug);
    const productData = await clientProductsService.getProductDetail(productId);

    // English content normalized from the original source text.
    const previousImages = (await parent).openGraph?.images || []

    // English content normalized from the original source text.
    const description = productData.description
      ? `${productData.description.slice(0, 150)}...`
      : `Mua ${productData.name}English content normalized from the original source text.`;

    return {
      title: `${productData.name} | ECSite`,
      description,
      openGraph: {
        title: productData.name,
        description,
        images: [
          ...(productData.images || []).map(img => ({
            url: img,
            width: 800,
            height: 600,
          })),
          ...previousImages,
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: productData.name,
        description,
        images: productData.images || [],
      },
    }
  } catch (error) {
    console.error('❌ [Metadata] Error generating metadata:', error);
    return {
      title: 'English content normalized from the original source text.',
      description: 'English content normalized from the original source text.',
    }
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  try {
    // English content normalized from the original source text.
    const productId = extractProductId(slug);
    console.log(`✅ [Server] Extracted product ID from slug: ${productId}`);

    // English content normalized from the original source text.
    const productData = await clientProductsService.getProductDetail(productId);
    console.log(`✅ [Server] Fetched product: ${productData.name} (ID: ${productData.id})`);

    // English content normalized from the original source text.
    return <ProductPageWrapper slug={slug} initialData={productData} />;
  } catch (error) {
    console.error('❌ [Server] Error fetching product:', error);
    // English content normalized from the original source text.
    throw error;
  }
}