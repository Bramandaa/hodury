import { Suspense } from "react";
import AddBannerForm from "./addBanerForm";
import BannerFormSkeleton from "@/components/skeletons/bannerSkeleton";

export default async function AddProductPage() {
  return (
    <>
      <Suspense fallback={<BannerFormSkeleton />}>
        <AddBannerForm />
      </Suspense>
    </>
  );
}
