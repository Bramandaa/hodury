import { AlertCard } from "@/components/alert";
import OrderTableSkeleton from "@/components/skeletons/orderTableSkeleton";
import { getOrdersByAdminWithCondition } from "@/lib/data-access/order";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import { Suspense } from "react";
import { OrderTable, SearchOrderForm } from "./orderContent";
import { SearchParamsDashboard } from "@/types";

export default async function DashboardOrderPage({
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
  const status = params.status || "all";

  const startDate = params.startDate ? new Date(params.startDate) : undefined;
  const endDate = params.endDate ? new Date(params.endDate) : undefined;

  const where: Prisma.OrderWhereInput = {};

  if (keyword) {
    where.OR = [
      { invoiceNumber: { contains: keyword, mode: "insensitive" } },
      { user: { name: { contains: keyword, mode: "insensitive" } } },
    ];
  }

  if (status && status !== "all") {
    where.status =
      status.toUpperCase() as Prisma.OrderScalarWhereInput["status"];
  }

  if (
    startDate instanceof Date &&
    !isNaN(startDate.getTime()) &&
    endDate instanceof Date &&
    !isNaN(endDate.getTime())
  ) {
    where.createdAt = {
      gte: startDate,
      lte: endDate,
    };
  }

  const orders = getOrdersByAdminWithCondition({ skip, limit, where });

  const totalItems = await prisma.order.count({ where });
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Daftar Pesanan</h2>
          {message && <AlertCard />}
        </div>
      </div>

      <SearchOrderForm params={params} />

      <Suspense
        key={`${skip}-${limit}-${keyword}-${status}-${
          startDate?.toISOString() || ""
        }-${endDate?.toISOString() || ""}`}
        fallback={<OrderTableSkeleton />}
      >
        <OrderTable
          orders={orders}
          page={page}
          limit={limit}
          totalPages={totalPages}
          query={queryString}
        />
      </Suspense>
    </div>
  );
}
