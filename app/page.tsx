import Banner from "@/components/banner";
import Navigation from "@/components/navigation";
import Products from "@/components/products";
import BannerSkeleton from "@/components/skeletons/bannerSkeleton";
import NavigationSkeletons from "@/components/skeletons/navigationSkeletons";
import { ProductsSkeleton } from "@/components/skeletons/productsSkeleton";
import { Separator } from "@/components/ui/separator";
import { getBanners } from "@/lib/data-access/banner";
import { getCartByUser } from "@/lib/data-access/cart";
import {
  getActiveProducts,
  getFeaturedProducts,
  getProductsWithCondition,
} from "@/lib/data-access/product";
import { getSession } from "@/lib/session";
import { Prisma } from "@prisma/client";
import { Suspense } from "react";

export default async function Home(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const keyword = (searchParams.search as string) || "";

  const session = await getSession();
  const cartData = session?.userId
    ? getCartByUser(session.userId)
    : Promise.resolve(null);

  if (keyword) {
    const where = {
      name: { contains: keyword, mode: Prisma.QueryMode.insensitive },
    };
    const searchProductsPromise = getProductsWithCondition(where);

    return (
      <>
        <Suspense
          fallback={<NavigationSkeletons search={keyword} session={session} />}
        >
          <Navigation session={session} search={keyword} cart={cartData} />
        </Suspense>
        <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-12">
          <div className="space-y-2">
            <h2 className="font-semibold text-lg sm:text-sm text-primary">
              {`Menampilkan produk untuk "${keyword}"`}
            </h2>
            <Suspense key={keyword} fallback={<ProductsSkeleton />}>
              <Products data={searchProductsPromise} />
            </Suspense>
          </div>
        </section>
      </>
    );
  } else {
    const banners = getBanners();
    const featuredPromise = getFeaturedProducts();
    const productsPromise = getActiveProducts();

    return (
      <>
        <Suspense
          fallback={<NavigationSkeletons search={keyword} session={session} />}
        >
          <Navigation session={session} search={keyword} cart={cartData} />
        </Suspense>
        <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-12">
          <Suspense fallback={<BannerSkeleton />}>
            <Banner banners={banners} />
          </Suspense>

          <div className="space-y-2">
            <h2 className="font-semibold text-lg sm:text-xl text-primary">
              Produk Unggulan
            </h2>
            <Suspense fallback={<ProductsSkeleton />}>
              <Products data={featuredPromise} />
            </Suspense>
          </div>
          <Separator />

          <div className="space-y-2">
            <h2 className="font-semibold text-lg sm:text-xl text-primary">
              Produk Terbaru
            </h2>
            <Suspense fallback={<ProductsSkeleton />}>
              <Products data={productsPromise} />
            </Suspense>
          </div>
        </section>
      </>
    );
  }
}
