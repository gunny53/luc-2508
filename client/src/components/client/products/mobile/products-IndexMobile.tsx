'use client';

import ProductGalleryMobile from './products-GalleryMobile';
import ProductInfoMobile from './products-InfoMobile';
import ProductSpecsMobile from './products-SpecMobile';
import ProductReviews from '../products-Reviews';
import ProductSuggestionsMobile from './products-SuggestionMobile';
import ProductsFooter from './products-Footer';
import ProductShopInfo from '../products-ShopInfo'
import { productMock } from './mockData';
import { slugify } from '@/utils/slugify';
import { ClientProductDetail } from "@/types/client.products.interface";
import { MediaItem, transformProductImagesToMedia } from '../shared/productTransformers';

interface Props {
  readonly slug: string;
  product?: ClientProductDetail | null;
  isLoading?: boolean;
}

export default function ProductDetailMobile({ slug, product: productData, isLoading = false }: Props) {
  // Show loading state if needed
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>English content normalized from the original source text.</p>
      </div>
    );
  }

  // English content normalized from the original source text.
  let productToUse;
  let media: MediaItem[];

  if (productData) {
    // English content normalized from the original source text.
    productToUse = productData;
    // English content normalized from the original source text.
    media = transformProductImagesToMedia(productData);
  } else {
    // English content normalized from the original source text.
    productToUse = productMock;
    // English content normalized from the original source text.
    media = (productMock.media || []).map(item => ({
      type: item.type === "video" ? "video" : "image",
      src: item.src
    })) as MediaItem[];
  }

  const sizes =
    productToUse?.variants?.find((v: any) => v.value === "English content normalized from the original source text.")?.options || [];
  const colors =
    productToUse?.variants?.find((v: any) => v.value === "English content normalized from the original source text.")?.options || [];

  // English content normalized from the original source text.
  const product = {
    ...productToUse,
    sizes,
    colors,
    media,
  };

   const defaultShop = {
    id: "cool-crew-12345",
    name: "Cool Crew",
    avatar: "/images/logo/coolcrew-logo.png", // English content normalized from the original source text.
    isOnline: true,
    lastActive: "English content normalized from the original source text.",
    rating: 3.7,
    responseRate: 100,
    responseTime: "English content normalized from the original source text.",
    followers: 5500,
    joinedDate: "English content normalized from the original source text.",
    productsCount: 86
  };

  const handleAddToCart = (skuId: string, quantity: number) => {
    console.log('English content normalized from the original source text.', { skuId, quantity });
    // English content normalized from the original source text.
  };

  const handleBuyNow = () => {
    console.log('Mua ngay');
    // English content normalized from the original source text.
  };

  const handleChat = () => {
    console.log('English content normalized from the original source text.');
    // English content normalized from the original source text.
  };

  return (
    <div className="bg-[#f5f5f5] pb-20">
      <ProductGalleryMobile media={product.media} />
      <ProductInfoMobile product={product as any} />
      <ProductShopInfo shop={defaultShop}/>
      <ProductSpecsMobile product={product as any} />
      <ProductReviews productId={String(product.id)} />
      <ProductSuggestionsMobile products={[]} />
      <ProductsFooter
        product={product as any}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onChat={handleChat}
      />
    </div>
  );
}