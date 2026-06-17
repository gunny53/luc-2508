"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { productsService } from "@/services/productsService";
import ProductFormWrapper from "@/components/admin/products/products-form/products-form-Wrapper";
import { ProductDetail } from "@/types/products.interface";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // English content normalized from the original source text.
        const resolvedParams = await params;
        const data = await productsService.getById(resolvedParams.id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setError("English content normalized from the original source text.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  // English content normalized from the original source text.
  if (loading) return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:p-10">
      <div className="mx-auto w-full max-w-7xl text-center">English content normalized from the original source text.</div>
    </main>
  );

  if (error) return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:p-10">
      <div className="mx-auto w-full max-w-7xl text-center text-red-500">{error}</div>
    </main>
  );

  if (!product) return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:p-10">
      <div className="mx-auto w-full max-w-7xl text-center">English content normalized from the original source text.</div>
    </main>
  );

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:p-10">
      <div className="mx-auto grid w-full max-w-7xl gap-2">
        <div className="flex items-center gap-2">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/products">English content normalized from the original source text.</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>English content normalized from the original source text. {product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div>
          <h1 className="text-3xl font-semibold">English content normalized from the original source text.</h1>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-start gap-6">
        <ProductFormWrapper initialData={product} />
      </div>
    </main>
  );
}
