import { AlertCard } from "@/components/alert";
import SearchFormSkeleton from "@/components/skeletons/searchFormSkeleton";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/data-access/category";
import { getProductsByAdminWithCondition } from "@/lib/data-access/product";
import Link from "next/link";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { ProductTable, SearchProductForm } from "./productContent";
import ProductTableSkeleton from "@/components/skeletons/productTableSkeleton";
import { SearchParamsDashboard } from "@/types";
import { Prisma, ProductStatus } from "@prisma/client";

export default async function ProductsPage({
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
  const category = params.category || "all";
  const status = params.status || "all";

  const where: Prisma.ProductWhereInput = {};

  if (keyword) {
    where.OR = [
      { name: { contains: keyword, mode: "insensitive" } },
      { category: { name: { contains: keyword, mode: "insensitive" } } },
    ];
  }

  if (category !== "all") {
    where.categoryId = parseInt(category);
  }

  if (status !== "all") {
    where.status = status.toUpperCase() as ProductStatus;
  }

  const categoriesPromise = getCategories();
  const productsPromise = getProductsByAdminWithCondition({
    skip,
    limit,
    where,
  });

  const totalItems = await prisma.product.count({ where });
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Produk</h2>
          {message && <AlertCard />}
        </div>
        {/* Action Bar */}
        <Link href="/dashboard/product/add">
          <Button className="bg-green-500 hover:bg-green-400 cursor-pointer">
            + Tambah Produk
          </Button>
        </Link>
      </div>

      <Suspense fallback={<SearchFormSkeleton />}>
        <SearchProductForm
          categoriesPromise={categoriesPromise}
          params={params}
        />
      </Suspense>

      <Suspense
        key={`${skip}-${limit}-${keyword}-${status}-${category}`}
        fallback={<ProductTableSkeleton />}
      >
        <ProductTable
          productsPromise={productsPromise}
          page={page}
          limit={limit}
          totalPages={totalPages}
          query={queryString}
        />
      </Suspense>
    </div>
  );
}
