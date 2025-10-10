import { getProduct } from "@/lib/data-access/product";
import { getSession } from "@/lib/session";
import { Suspense } from "react";
import ProductDetail from "./productDetailContent";
import { ProductDetailSkeleton } from "@/components/skeleton/productDetailSkeleton";

export default async function DetailProductPage({ params }) {
  const { slug } = await params;

  const session = await getSession();
  const product = getProduct(slug);

  if (!product) {
    return <div>Produk Tidak Ditemukan</div>;
  }

  return (
    <>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail product={product} session={session} />
      </Suspense>
    </>
  );
}
