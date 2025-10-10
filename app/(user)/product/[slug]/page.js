import { getProduct } from "@/lib/data-access/product";
import ProductDetailContent from "./productDetailContent";
import { getSession } from "@/lib/session";

export default async function DetailProductPage({ params }) {
  const { slug } = await params;

  const [product, session] = await Promise.all([
    getProduct(slug),
    getSession(),
  ]);

  if (!product) {
    return <div>Produk Tidak Ditemukan</div>;
  }

  return (
    <>
      <ProductDetailContent product={product} session={session} />
    </>
  );
}
