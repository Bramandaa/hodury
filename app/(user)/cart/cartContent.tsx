"use client";

import { removeCartItem, updateCartQuantity } from "@/action/cart";
import { checkoutCart } from "@/action/checkout";
import CartItem from "@/components/cartItem";
import EmptyItem from "@/components/emptyItem";
// import EmptyPage from "@/components/EmptyPage";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { CartDTO, toCartItemDTO } from "@/lib/dto/cart";
import { Session } from "@/lib/session";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ShoppingCart } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";

export function CartContent({
  session,
  cartDataPromise,
}: {
  session: Session | null;
  cartDataPromise: Promise<CartDTO | null>;
}) {
  const cartData = use(cartDataPromise);
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const total = useMemo(() => {
    return (
      cartData?.items
        ?.filter((item) => selectedIds.includes(item.cartItemId))
        .reduce(
          (acc, item) => acc + (item.product?.price ?? 0) * item.quantity,
          0
        ) ?? 0
    );
  }, [cartData?.items, selectedIds]);

  function getCartKey(item: ReturnType<typeof toCartItemDTO>) {
    return item.cartItemId ?? item.product?.id;
  }

  function handleToggleItem(
    item: ReturnType<typeof toCartItemDTO>,
    checked: CheckedState
  ) {
    const id = getCartKey(item);
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  }

  function handleToggleAll(checked: boolean) {
    if (checked) {
      setSelectedIds(cartData?.items?.map(getCartKey) ?? []);
    } else {
      setSelectedIds([]);
    }
  }

  // Ubah jumlah item
  async function handleUpdateQuantity(cartItemId: number, diff: number) {
    try {
      setLoadingId(cartItemId);

      const current = cartData?.items?.find((i) => i.cartItemId === cartItemId);
      if (!current) return;

      const newQty = current.quantity + diff;

      if (newQty <= 0) {
        await removeCartItem(cartItemId);
      } else {
        await updateCartQuantity(cartItemId, newQty);
      }
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  // Hapus item individual
  async function handleRemove(cartItemId: number) {
    setLoadingId(cartItemId);
    await removeCartItem(cartItemId);
    router.refresh();
    setLoadingId(null);
  }

  async function handleCheckout() {
    if (!session?.userId) {
      redirect("/login");
    }

    if (selectedIds.length === 0) return;

    try {
      setLoadingCheckout(true);
      const result = await checkoutCart({
        userId: session.userId,
        cartItemIds: selectedIds,
      });

      setSelectedIds([]);
      router.replace(`/checkout/${result.invoiceNumber}`);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat checkout");
    } finally {
      setLoadingCheckout(false);
    }
  }

  if (!cartData?.items || cartData?.items.length === 0) {
    return (
      <EmptyItem
        message={"Yuk, mulai belanja dan tambahkan produk ke keranjangmu!"}
        href={"/"}
        buttonMessage={"Mulai Belanja"}
      >
        <div className="p-6 rounded-full shadow-md">
          <ShoppingCart className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-primary">Belum ada item</h2>
      </EmptyItem>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-4">
        <Card className="rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={
                  selectedIds?.length === cartData?.items?.length &&
                  cartData?.items?.length > 0
                }
                onCheckedChange={handleToggleAll}
                className="w-5 h-5 md:w-6 md:h-6"
              />
              <span className="text-sm font-medium">Pilih Semua</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={`${
                selectedIds?.length === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-red-500 hover:text-red-600"
              }`}
              onClick={async () => {
                if (selectedIds?.length === 0) return;
                for (const id of selectedIds) {
                  try {
                    setLoadingId(id);
                    await removeCartItem(id);
                  } finally {
                    setLoadingId(null);
                  }
                }
                router.refresh();
                setSelectedIds([]);
              }}
              disabled={selectedIds?.length === 0}
            >
              Hapus
            </Button>
          </div>
        </Card>

        {cartData?.items?.map((item, idx, arr) => (
          <CartItem
            key={item.cartItemId}
            arr={arr}
            idx={idx}
            item={item}
            loading={loadingId}
            isSelected={selectedIds.includes(getCartKey(item))}
            onToggle={handleToggleItem}
            onRemove={handleRemove}
            onUpdateQuantity={handleUpdateQuantity}
          />
        ))}
      </div>

      <div className="w-full md:w-[35%]">
        <Card className="rounded-lg shadow-sm fixed bottom-0 left-0 right-0 z-20 md:sticky md:top-[72px]">
          <CardHeader>
            <CardTitle>Ringkasan Belanja</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Total Harga ({selectedIds?.length} barang)</span>
              <span>Rp {total.toLocaleString("id-ID")}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
            <Button
              className="w-full bg-primary text-white rounded-lg cursor-pointer"
              onClick={handleCheckout}
              disabled={selectedIds?.length === 0 || loadingCheckout}
            >
              {loadingCheckout ? <Spinner /> : "Beli"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
