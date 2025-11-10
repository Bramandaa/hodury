import { getCategoriesByAdminWithCondition } from "@/lib/data-access/category";
import { SearchParamsDashboard } from "@/types";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { AlertCard } from "@/components/alert";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CategoryTable, SearchCategoryForm } from "./categoryContent";
import { Suspense } from "react";
import CategoryTableSkeleton from "@/components/skeletons/categoryTableSkeleton";
import SearchFormSkeleton from "@/components/skeletons/searchFormSkeleton";

export default async function CategoriesPage({
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

  const where: Prisma.CategoryWhereInput = {};

  if (keyword) {
    where.OR = [{ name: { contains: keyword, mode: "insensitive" } }];
  }

  const categoriesPromise = getCategoriesByAdminWithCondition({
    skip,
    limit,
    where,
  });

  const totalItems = await prisma.category.count({ where });
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Kategori Produk</h2>
          {message && <AlertCard />}
        </div>
        <Link href="/dashboard/category/add">
          <Button className="bg-green-500 hover:bg-green-400 cursor-pointer">
            + Tambah Kategori
          </Button>
        </Link>
      </div>
      <Suspense fallback={<SearchFormSkeleton />}>
        <SearchCategoryForm params={params} />
      </Suspense>

      <Suspense
        key={`${skip}-${limit}-${keyword}`}
        fallback={<CategoryTableSkeleton />}
      >
        <CategoryTable
          categoriesPromise={categoriesPromise}
          page={page}
          limit={limit}
          totalPages={totalPages}
          query={queryString}
        />
      </Suspense>
    </div>
  );
}
