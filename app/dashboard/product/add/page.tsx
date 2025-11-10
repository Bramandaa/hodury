import { getCategories } from "@/lib/data-access/category";
import { Suspense } from "react";
import AddProductForm from "./addProductForm";
import DashboardProductFormSkeleton from "@/components/skeletons/dsahboardProductFormSkeleton";

export default async function AddProductPage() {
  const categoriesPromise = getCategories();

  return (
    <>
      <Suspense fallback={<DashboardProductFormSkeleton />}>
        <AddProductForm categoriesPromise={categoriesPromise} />
      </Suspense>
    </>
  );
}
