"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { OrderStatus } from "@/types/order.interface";

export const OrderTabs = ({ counts }: { counts: Record<string, number> }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (el) {
      setShowLeftArrow(el.scrollLeft > 0);
      setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);

    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const tabValues = [
    { value: "all", label: "English content normalized from the original source text.", count: counts.all },
    {
      value: OrderStatus.PENDING_PAYMENT,
      label: "English content normalized from the original source text.",
      count: counts.pendingPayment,
    },
    {
      value: OrderStatus.PENDING_PACKAGING,
      label: "English content normalized from the original source text.",
      count: counts.pendingPackaging,
    },
    {
      value: OrderStatus.PICKUPED,
      label: "English content normalized from the original source text.",
      count: counts.pickuped,
    },
    {
      value: OrderStatus.PENDING_DELIVERY,
      label: "English content normalized from the original source text.",
      count: counts.pendingDelivery,
    },
    { value: OrderStatus.DELIVERED, label: "English content normalized from the original source text.", count: counts.delivered },
    { value: OrderStatus.RETURNED, label: "English content normalized from the original source text.", count: counts.returned },
    { value: OrderStatus.CANCELLED, label: "English content normalized from the original source text.", count: counts.cancelled },
  ];

  return (
    <div className="relative w-full">
      <div ref={scrollRef} className="w-full overflow-x-auto scrollbar-hide">
        <TabsList className="flex w-max min-w-full bg-white border-b h-12 gap-1 p-1">
          {tabValues.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="\n                relative flex-shrink-0 whitespace-nowrap\n                text-xs font-medium text-gray-600\n                px-3 py-2 rounded-md\n                hover:bg-gray-50 hover:text-gray-800\n                data-[state=active]:bg-[#D70018]/10 \n                data-[state=active]:text-[#D70018]\n                data-[state=active]:font-semibold\n                transition-all duration-200\n                flex items-center gap-2\n              "
            >
              <span>{tab.label}</span>

              {/* English content normalized from the original source text. */}
              {tab.count > 0 && (
                <div
                  className="\n                  w-5 h-5 rounded-full\n                  bg-gradient-to-r from-[#D70018] to-[#FF4444]\n                  text-white text-[10px] font-bold\n                  flex items-center justify-center\n                  shadow-md\n                  data-[state=active]:from-white data-[state=active]:to-white \n                  data-[state=active]:text-[#D70018]\n                  transition-all duration-200\n                "
                >
                  {tab.count > 99 ? "99+" : tab.count}
                </div>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Navigation arrows */}
      {showLeftArrow && (
        <div className="absolute left-0 top-0 h-full w-8 flex items-center bg-gradient-to-r from-white to-transparent md:hidden">
          <ChevronLeft className="text-gray-400 w-4 h-4" />
        </div>
      )}

      {showRightArrow && (
        <div className="absolute right-0 top-0 h-full w-8 flex items-center justify-end bg-gradient-to-l from-white to-transparent md:hidden">
          <ChevronRight className="text-gray-400 w-4 h-4" />
        </div>
      )}
    </div>
  );
};
