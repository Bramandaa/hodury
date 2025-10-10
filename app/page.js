import Banner from "@/components/banner";
import EmptyPage from "@/components/EmptyPage";
import Navigation from "@/components/navigation";
import Products from "@/components/products";
import { ProductsSkeleton } from "@/components/skeleton/productsSkeleton";
import { getBanners } from "@/lib/data-access/banner";
import { getCartByUser } from "@/lib/data-access/cart";
import {
  getActiveProducts,
  getFeaturedProducts,
  getProducstWithCondition,
} from "@/lib/data-access/product";
import { getSession } from "@/lib/session";
import { Suspense } from "react";

export default async function Home(props) {
  const searchParams = (await props.searchParams) || {};
  const keyword = searchParams.search || "";

  // Data yang akan di-use() di komponen
  let productsPromise;
  let banners;
  let featuredPromise;
  let searchProductsPromise;

  if (keyword) {
    const where = { name: { contains: keyword, mode: "insensitive" } };
    searchProductsPromise = getProducstWithCondition(where);
  } else {
    banners = getBanners();
    productsPromise = getActiveProducts();
    featuredPromise = getFeaturedProducts();
  }

  const session = await getSession();
  const cartData = session?.userId ? await getCartByUser(session.userId) : [];

  return (
    <>
      <Navigation session={session} cartData={cartData} />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-12">
        {!searchProductsPromise && <Banner banners={banners} />}

        {featuredPromise && (
          <div className="space-y-2">
            <h2 className="font-semibold text-lg sm:text-xl text-primary">
              Produk Unggulan
            </h2>
            <Suspense fallback={<ProductsSkeleton />}>
              <Products data={featuredPromise} />
            </Suspense>
          </div>
        )}

        {productsPromise && (
          <div className="space-y-2">
            <h2 className="font-semibold text-lg sm:text-xl text-primary">
              Produk Terbaru
            </h2>
            <Suspense fallback={<ProductsSkeleton />}>
              <Products data={productsPromise} />
            </Suspense>
          </div>
        )}

        {searchProductsPromise && (
          <div className="space-y-2">
            <h2 className="font-semibold text-lg sm:text-sm text-primary">
              {`Menampilkan produk untuk "${keyword}"`}
            </h2>
            <Suspense fallback={<ProductsSkeleton />}>
              <Products data={searchProductsPromise} />
            </Suspense>
          </div>
        )}
      </section>
    </>
  );
}
