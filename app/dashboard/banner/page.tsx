import { AlertCard } from "@/components/alert";
import { Button } from "@/components/ui/button";
import { SearchParamsDashboard } from "@/types";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { BannerTable, SearchBannerForm } from "./bannerContent";
import { getBannersByAdminWithCondition } from "@/lib/data-access/banner";
import { Suspense } from "react";
import SearchFormSkeleton from "@/components/skeletons/searchFormSkeleton";
import BannerTableSkeleton from "@/components/skeletons/bannerTableSkeleton";

export default async function BannerPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsDashboard>;
}) {
  const params = await searchParams;
  const message = params.success;

  const newParams = new URLSearchParams(params);
  newParams.delete("success");
  const queryString = newParams.toString();

  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "5", 10);
  const skip = (page - 1) * limit;
  const keyword = params.keyword || "";

  const where: Prisma.BannerWhereInput = {};

  if (keyword) {
    where.OR = [{ name: { contains: keyword, mode: "insensitive" } }];
  }

  const bannerPromise = getBannersByAdminWithCondition({
    skip,
    limit,
    where,
  });

  const totalItems = await prisma.banner.count({ where });
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Banner Promosi</h2>
          {message && <AlertCard />}
        </div>
        <Link href="/dashboard/banner/add">
          <Button className="bg-green-500 hover:bg-green-400 cursor-pointer">
            + Tambah Banner
          </Button>
        </Link>
      </div>
      <Suspense fallback={<SearchFormSkeleton />}>
        <SearchBannerForm params={params} />
      </Suspense>
      <Suspense
        key={`${skip}-${limit}-${keyword}`}
        fallback={<BannerTableSkeleton />}
      >
        <BannerTable
          bannerPromise={bannerPromise}
          page={page}
          limit={limit}
          totalPages={totalPages}
          query={queryString}
        />
      </Suspense>
    </div>
  );
}
