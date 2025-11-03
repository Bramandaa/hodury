"use client";

import { addToCart } from "@/action/cart";
import EmptyItem from "@/components/emptyItem";
import Spinner from "@/components/spinner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductDTO } from "@/lib/dto/product";
import { Session } from "@/lib/session";

import { Minus, PackageSearch, Plus } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { use, useState, useTransition } from "react";
import { toast } from "sonner";

export default function ProductDetail({
  product,
  session,
  date,
}: {
  product: Promise<ProductDTO | null>;
  session: Session | null;
  date: string;
}) {
  const productData = use(product);

  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const subtotal = (productData?.price ?? 0) * quantity;

  async function handleAddToCart() {
    startTransition(async () => {
      try {
        await addToCart(productData?.id as number, quantity);
        toast.success(`${productData?.name} ditambahkan ke keranjang`);
      } catch {
        toast.error("Gagal menambahkan ke keranjang");
      }
    });
  }

  if (!productData) {
    return (
      <EmptyItem
        message={
          "Produk yang kamu cari tidak ditemukan atau sudah tidak tersedia."
        }
        href={"/"}
        buttonMessage={"Kembali ke Beranda"}
      >
        <div className="p-6 rounded-full shadow-md">
          <PackageSearch className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-primary">
          Produk Tidak Ditemukan
        </h2>
      </EmptyItem>
    );
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
          <div className="relative w-full max-w-60 aspect-square rounded-lg overflow-hidden md:shadow-md">
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
              {/* Terjual {productData?.sold} */}
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
                Pengiriman berikutnya dijadwalkan pada <b>{date}</b>.
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
                onClick={() => {
                  if (!session) return redirect("/login");
                  handleAddToCart();
                }}
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
