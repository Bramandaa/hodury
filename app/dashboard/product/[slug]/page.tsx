import { getProduct } from "@/lib/data-access/product";
import { getCategories } from "@/lib/data-access/category";
import { Suspense } from "react";
import EditProductForm from "./editProductForm";
import { SearchParamsDashboard } from "@/types";
import DashboardProductFormSkeleton from "@/components/skeletons/dsahboardProductFormSkeleton";

export default async function DetailProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParamsDashboard>;
}) {
  const { slug } = await params;
  const newParams = new URLSearchParams(await searchParams);
  newParams.delete("success");
  const queryString = newParams.toString();

  const productPromise = getProduct(slug);
  const categoriesPromise = getCategories();

  return (
    <Suspense fallback={<DashboardProductFormSkeleton />}>
      <EditProductForm
        productPromise={productPromise}
        categoriesPromise={categoriesPromise}
        query={queryString}
      />
    </Suspense>
  );
}
