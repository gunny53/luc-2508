"use client";

import { useEffect, useState } from "react";
import { ClientProduct } from "@/types/client.products.interface";
import ProductItem from "@/components/ui/product-component/product-Item";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductsContext } from "../context/ProductsContext";
import { useSearchParams } from "next/navigation";

export default function SearchProductGridMobile() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const {
    products,
    isLoading,
    isError,
    currentPage,
    handlePageChange,
    paginationData: { hasNextPage },
  } = useProductsContext();

  const [observerTarget, setObserverTarget] = useState<HTMLDivElement | null>(null);

  // Infinite scroll observer
  useEffect(() => {
    if (!observerTarget) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading && hasNextPage) {
        handlePageChange(currentPage + 1);
      }
    });

    observer.observe(observerTarget);
    return () => observer.disconnect();
  }, [observerTarget, isLoading, hasNextPage, currentPage, handlePageChange]);

  // English content normalized from the original source text.
  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array(6).fill(null).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[180px] w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // English content normalized from the original source text.
  if (isError) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">English content normalized from the original source text.</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >English content normalized from the original source text.</button>
      </div>
    );
  }

  // English content normalized from the original source text.
  if (products.length === 0 && !isLoading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="text-black text-lg mb-2">
          {searchQuery
            ? `English content normalized from the original source text.${searchQuery}"`
            : "English content normalized from the original source text."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* English content normalized from the original source text. */}
      <div className="grid grid-cols-2 gap-3">
        {products.map((product: ClientProduct) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>

      {/* English content normalized from the original source text. */}
      {isLoading && products.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {Array(4).fill(null).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[180px] w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* English content normalized from the original source text. */}
      {hasNextPage && <div ref={setObserverTarget} className="h-10" />}
    </div>
  );
}
