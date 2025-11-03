import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { toCartItemDTO } from "@/lib/dto/cart";
import { CheckedState } from "@radix-ui/react-checkbox";

export default function CartItem({
  arr,
  idx,
  item,
  loading,
  isSelected,
  onToggle,
  onRemove,
  onUpdateQuantity,
}: {
  arr: ReturnType<typeof toCartItemDTO>[];
  idx: number;
  item: ReturnType<typeof toCartItemDTO>;
  isSelected: boolean;
  loading: number | null;
  onToggle: (
    item: ReturnType<typeof toCartItemDTO>,
    checked: CheckedState
  ) => void;
  onRemove: (cartItemId: number) => Promise<void>;
  onUpdateQuantity: (cartItemId: number, diff: number) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempQuantity, setTempQuantity] = useState(item.quantity);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (tempQuantity !== item.quantity) {
      setIsSaving(true);
      await onUpdateQuantity(item.cartItemId, tempQuantity - item.quantity);
      setIsSaving(false);
    }
    setIsEditing(false);
  };

  return (
    <Card
      key={item.cartItemId}
      className={`relative rounded-lg shadow-sm overflow-hidden transition-all duration-300 py-1 ${
        idx === arr?.length - 1 ? "mb-60 md:mb-0" : ""
      }`}
    >
      {isSaving && (
        <div className="absolute inset-0 z-10 backdrop-blur-[2px] bg-white/30 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        </div>
      )}
      <CardContent className="flex items-center gap-3 p-4">
        {/* Checkbox */}
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(item, checked)}
          className="w-5 h-5 md:w-6 md:h-6"
          disabled={isEditing || isSaving}
        />

        {/* Gambar produk */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden shrink-0">
          <Image
            src={item.product?.imageUrl ?? "/placeholder.png"}
            alt={item.product?.name ?? "Product image"}
            fill
            priority
            sizes="100vh"
            className="object-contain"
          />
        </div>

        {/* Nama dan harga */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-normal text-primary truncate">
            {item?.product?.name}
          </div>
          <div className="font-semibold text-primary text-sm md:text-base">
            Rp {item?.product?.price.toLocaleString("id-ID")}
          </div>
        </div>

        {/* Kontrol jumlah & hapus */}
        <div className="flex flex-col items-end space-y-2 shrink-0">
          {/* Tombol Edit / Selesai */}
          <Button
            variant={isEditing ? "secondary" : "outline"}
            size="icon"
            className={`px-8 ${
              isEditing
                ? "text-white bg-green-500 hover:text-green-600"
                : "text-blue-500 hover:text-blue-600"
            } cursor-pointer`}
            disabled={isSaving}
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? "Simpan" : "Ubah"}
          </Button>
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!isEditing || isSaving}
              onClick={() => setTempQuantity((q) => Math.max(1, q - 1))}
            >
              <Minus size={18} />
            </Button>
            <div className="px-2 md:px-3 text-sm md:text-base">
              {tempQuantity}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!isEditing || isSaving}
              onClick={() => setTempQuantity((q) => q + 1)}
            >
              <Plus size={18} />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            disabled={loading === item.cartItemId || isSaving}
            className="text-red-500 hover:text-red-600 h-6 w-6 md:h-8 md:w-8"
            onClick={() => onRemove(item.cartItemId)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
