import { BaseResponse, BaseEntity, PaginationMetadata } from "./base.interface"

/* English content normalized from the original source text. */
export interface ShopInfo {
    id: string;
    name: string;
    avatar?: string;
}

/* English content normalized from the original source text. */
export interface ProductInfo {
    id: string;
    publishedAt: string;
    name: string;
    description: string;
    basePrice: number;
    virtualPrice: number;
    brandId: string;
    images: string[];
    sku: SkuInfo;
    variants: Array<{
        value: string;
        options: string[];
    }>;
    productTranslations: any[];
}

/* English content normalized from the original source text. */
export interface SkuInfo {
    id: string;
    value: string;
    price: number;
    stock: number;
    image: string;
    productId: string;
    product: ProductInfo;
}

/* English content normalized from the original source text. */
export interface CartItem extends Partial<BaseEntity> {
    id: string;
    quantity: number;
    skuId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    sku: SkuInfo;
    isSelected?: boolean; // English content normalized from the original source text.
}

/* English content normalized from the original source text. */
export interface ShopCart {
    shop: ShopInfo;
    cartItems: CartItem[];
    isSelected?: boolean; // English content normalized from the original source text.
}

/* English content normalized from the original source text. */
export interface CartListResponse extends BaseResponse {
    data: ShopCart[];
    metadata?: PaginationMetadata;
}

/* English content normalized from the original source text. */
export interface Cart {
    shops: ShopCart[];
    totalItems: number;
    totalPrice: number;
    totalSelectedItems: number;
    totalSelectedPrice: number;
}

/* English content normalized from the original source text. */
export interface CartResponse extends BaseResponse {
    data: CartItem | {
        cartItem?: CartItem;
    };
}

/* English content normalized from the original source text. */
export interface CartItemRequest {
    skuId: string;
    quantity: number;
}

/* English content normalized from the original source text. */
export interface UpdateCartItemRequest {
    skuId: string;
    quantity: number;
    isSelected?: boolean;
}

/* English content normalized from the original source text. */
export interface DeleteCartRequest {
    cartItemIds: string[];
}

/* English content normalized from the original source text. */
export interface SelectCartItemsRequest {
    cartItemIds: string[];
    isSelected: boolean;
}

/* English content normalized from the original source text. */
export interface CartSummary {
    totalItems: number;
    totalSelectedItems: number;
    totalPrice: number;
    totalSelectedPrice: number;
    totalShops: number;
}