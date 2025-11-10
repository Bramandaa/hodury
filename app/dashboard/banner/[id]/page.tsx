import { getBanner } from "@/lib/data-access/banner";
import { SearchParamsDashboard } from "@/types";
import EditBannerForm from "./editBannerForm";
import { Suspense } from "react";
import BannerFormSkeleton from "@/components/skeletons/bannerSkeleton";

export default async function DetailBannerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: number }>;
  searchParams: Promise<SearchParamsDashboard>;
}) {
  const { id } = await params;
  const newParams = new URLSearchParams(await searchParams);
  newParams.delete("success");
  const queryString = newParams.toString();

  const bannerPromise = getBanner(Number(id));

  return (
    <>
      <Suspense fallback={<BannerFormSkeleton />}>
        <EditBannerForm bannerPromise={bannerPromise} query={queryString} />
      </Suspense>
    </>
  );
}
