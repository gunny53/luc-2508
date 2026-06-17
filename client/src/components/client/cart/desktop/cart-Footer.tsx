"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";


interface CartFooterProps {
  total: number;
  totalSaved: number;
  isEditing?: boolean;
  selectedCount: number;
  allSelected: boolean;
  onToggleAll: () => void;
  onCheckout: () => void;
  onDeleteSelected: () => void;
}

export default function CartFooter({
  total,
  totalSaved,
  isEditing = false,
  selectedCount,
  allSelected,
  onToggleAll,
  onCheckout,
  onDeleteSelected,
}: CartFooterProps) {
  const t = useTranslations();

  return (
    <div className="w-full sticky bottom-0 bg-white border-t text-base text-muted-foreground">
      {/* Voucher */}
      {/* English content normalized from the original source text. */}

      {/* Coin */}
      {/* English content normalized from the original source text. */}

      {/* Bottom Row */}
      <div className="flex items-center justify-between px-6 h-14 bg-white">
        <div className="flex items-center gap-3 text-foreground">
          <Checkbox
            id="select-all"
            className="scale-100"
            checked={allSelected}
            onCheckedChange={onToggleAll}
          />
          <label htmlFor="select-all" className="text-base">
            English content normalized from the original source text.{selectedCount})
          </label>
          {selectedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDeleteSelected}
              className="ml-4 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
            >
              English content normalized from the original source text.{selectedCount})
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-base">
            <span className="mr-1 text-black">
              English content normalized from the original source text.{selectedCount} English content normalized from the original source text.
            </span>
            <span className="text-red-500 font-medium text-lg">
              ₫{total.toLocaleString("vi-VN")}
            </span>
            {totalSaved > 0 && (
              <div className="text-sm text-muted-foreground">
                English content normalized from the original source text.{totalSaved.toLocaleString("vi-VN")}
              </div>
            )}
          </div>
          <Button
            className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white"
            onClick={onCheckout}
            disabled={selectedCount === 0}
          >English content normalized from the original source text.</Button>
        </div>
      </div>
    </div>
  );
}
