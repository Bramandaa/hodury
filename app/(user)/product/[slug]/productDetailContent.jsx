"use client";

import { use, useState, useTransition } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { addToCart } from "@/action/cart";
import Spinner from "@/components/spinner";

export default function ProductDetail({ product, session }) {
  const productData = use(product);
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const subtotal = productData?.price * quantity;

  // Hitung estimasi pengiriman berikutnya
  const today = new Date();
  let nextDelivery = new Date(today.getFullYear(), today.getMonth(), 10);
  if (today.getDate() > 10) {
    nextDelivery = new Date(today.getFullYear(), today.getMonth() + 1, 10);
  }
  const nextDeliveryFormatted = format(nextDelivery, "d MMMM yyyy", {
    locale: id,
  });

  async function handleAddToCart() {
    startTransition(async () => {
      try {
        await addToCart(productData?.id, quantity);
        toast.success(`${productData?.name} ditambahkan ke keranjang`);
      } catch (err) {
        toast.error("Gagal menambahkan ke keranjang");
      }
    });
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={"/category/" + productData?.category?.slug}>
              {productData?.category?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={"/product/" + productData?.slug}
              className="font-semibold text-foreground"
            >
              {productData?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Product Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left - Product Image */}
        <div className="md:col-span-3 flex justify-center md:justify-start">
          <div className="relative w-full max-w-[240px] aspect-square rounded-lg overflow-hidden md:shadow-md">
            <Image
              src={productData?.imageUrl}
              alt={productData?.name}
              sizes="100vh"
              fill
              priority
              className="object-contain p-2 w-full h-full"
            />
          </div>
        </div>

        {/* Middle - Product Info */}
        <div className="space-y-4 md:col-span-6">
          <div>
            <h1 className="text-2xl font-semibold">{productData?.name}</h1>
            <p className="text-sm text-muted-foreground">
              Terjual {productData?.sold}
            </p>
            <p className="text-2xl font-bold mt-2">
              Rp {productData?.price.toLocaleString("id-ID")}
            </p>
          </div>

          <Separator />

          <div className="w=full">
            <div className="w-fit font-medium rounded-none px-5 pb-1 text-sm">
              Detail Produk
            </div>
            <div className="relative">
              <div className="absolute w-32 h-0.5 rounded-full bg-primary"></div>
              <div className="w-full h-0.5 bg-border rounded-full"></div>
            </div>
            <div className="pt-2 text-sm text-primary">
              {productData?.description}
            </div>
          </div>
        </div>

        {/* Right - Cart Summary */}
        <div className="md:col-span-3">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Ringkasan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted p-2 text-xs text-muted-foreground">
                Pengiriman berikutnya dijadwalkan pada{" "}
                <b>{nextDeliveryFormatted}</b>.
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Total */}
              <div className="flex justify-between text-base font-semibold">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>

              {/* Add to Cart */}
              <Button
                className="w-full bg-primary cursor-pointer"
                onClick={!session ? () => redirect("/login") : handleAddToCart}
                disabled={isPending}
              >
                {isPending ? <Spinner /> : "+ Keranjang"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
