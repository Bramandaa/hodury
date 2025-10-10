"use client";

import { removeCartItem, updateCartQuantity } from "@/action/cart";
import { checkoutCart } from "@/action/checkout";
import EmptyPage from "@/components/EmptyPage";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export function CartContent({ cartData, session }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const total = useMemo(() => {
    return (
      cartData
        ?.filter((item) => selectedIds.includes(item.cartItemId))
        .reduce((acc, item) => acc + item.product.price * item.quantity, 0) ?? 0
    );
  }, [cartData, selectedIds]);

  function getCartKey(item) {
    return item.cartItemId ?? item.productId ?? item.product?.id;
  }

  function handleToggleItem(item, checked) {
    const id = getCartKey(item);
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  }

  function handleToggleAll(checked) {
    if (checked) {
      setSelectedIds(cartData?.map(getCartKey));
    } else {
      setSelectedIds([]);
    }
  }

  async function handleUpdateQuantity(cartItemId, diff) {
    try {
      setLoadingId(cartItemId);

      // cari item di cart
      const current = cartData?.find((i) => i.cartItemId === cartItemId);
      if (!current) return;

      const newQty = current.quantity + diff;

      // kalau quantity jadi < 1, anggap hapus item
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

  async function handleRemove(cartItemId) {
    setLoadingId(cartItemId);
    await removeCartItem(cartItemId);
    router.refresh();
    setLoadingId(null);
  }

  async function handleCheckout() {
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

  if (!cartData || cartData.length === 0) {
    return (
      <EmptyPage
        message={"Yuk, mulai belanja dan tambahkan produk ke keranjangmu!"}
        href={"/"}
        buttonMessage={"Mulai Belanja"}
      >
        <div className="p-6 rounded-full shadow-md">
          <ShoppingCart className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-primary">Belum ada item</h2>
      </EmptyPage>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Bagian kiri: daftar item */}
      <div className="flex-1 space-y-4">
        {/* Pilih semua */}
        <Card className="rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={
                  selectedIds?.length === cartData?.length &&
                  cartData?.length > 0
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

        {cartData?.map((item, idx, arr) => (
          <Card
            key={item.cartItemId}
            className={`rounded-lg shadow-sm ${
              idx === arr?.length - 1 ? "mb-60 md:mb-0" : ""
            }`}
          >
            <CardContent className="flex items-center gap-3 p-4">
              <Checkbox
                checked={selectedIds.includes(getCartKey(item))}
                onCheckedChange={(checked) => handleToggleItem(item, checked)}
                className="w-5 h-5 md:w-6 md:h-6"
              />

              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden  flex-shrink-0">
                <Image
                  src={item?.product?.imageUrl}
                  alt={item?.product?.name}
                  fill
                  priority
                  sizes="100vh"
                  className="object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-normal text-primary truncate">
                  {item?.product?.name}
                </div>
                <div className="font-semibold text-primary text-sm md:text-base">
                  Rp {item?.product?.price.toLocaleString("id-ID")}
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={loadingId === item.cartItemId}
                    onClick={() => handleUpdateQuantity(item.cartItemId, -1)}
                  >
                    <Minus size={18} />
                  </Button>
                  <div className="px-2 md:px-3 text-sm md:text-base">
                    {item.quantity}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={loadingId === item.cartItemId}
                    onClick={() => handleUpdateQuantity(item.cartItemId, +1)}
                  >
                    <Plus size={18} />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={loadingId === item.cartItemId}
                  className="text-red-500 hover:text-red-600 h-6 w-6 md:h-8 md:w-8"
                  onClick={() => handleRemove(item.cartItemId)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bagian kanan: ringkasan belanja */}
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
