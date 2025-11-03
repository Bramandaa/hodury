import { getProduct } from "@/lib/data-access/product";
import { getSession } from "@/lib/session";
import { Suspense } from "react";
import ProductDetail from "./productDetail";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ProductDetailSkeleton } from "@/components/skeletons/productDetailSkeleton";

export default async function DetailProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await getSession();
  const product = getProduct(slug);

  const today = new Date();
  let nextDelivery = new Date(today.getFullYear(), today.getMonth(), 10);
  if (today.getDate() > 10) {
    nextDelivery = new Date(today.getFullYear(), today.getMonth() + 1, 10);
  }
  const nextDeliveryFormatted = format(nextDelivery, "d MMMM yyyy", {
    locale: id,
  });

  return (
    <>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail
          product={product}
          session={session}
          date={nextDeliveryFormatted}
        />
      </Suspense>
    </>
  );
}
