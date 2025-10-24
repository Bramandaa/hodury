import { getProduct } from "@/lib/data-access/product";
import { getSession } from "@/lib/session";
import { Suspense } from "react";
import ProductDetail from "./productDetail";
import { ProductDetailSkeleton } from "@/components/skeletons/productDetailSkeleton";

export default async function DetailProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await getSession();
  const product = getProduct(slug);

  return (
    <>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail product={product} session={session} />
      </Suspense>
    </>
  );
}
