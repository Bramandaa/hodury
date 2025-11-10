import { getCategory } from "@/lib/data-access/category";
import EditCategoryForm from "./editCategoryForm";
import { SearchParamsDashboard } from "@/types";
import { Suspense } from "react";
import EditCategoryFormSkeleton from "@/components/skeletons/categoryEditFormSkeleton";

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

  const categoryPromise = getCategory(slug);

  return (
    <>
      <Suspense fallback={<EditCategoryFormSkeleton />}>
        <EditCategoryForm
          categoryPromise={categoryPromise}
          query={queryString}
        />
      </Suspense>
    </>
  );
}
