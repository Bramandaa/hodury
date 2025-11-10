import { Suspense } from "react";
import AddCategoryForm from "./addCategoryForm";
import AddCategoryFormSkeleton from "@/components/skeletons/categoryAddFormSkeleton";

export default async function AddCategoryPage() {
  return (
    <>
      <Suspense fallback={<AddCategoryFormSkeleton />}>
        <AddCategoryForm />
      </Suspense>
    </>
  );
}
