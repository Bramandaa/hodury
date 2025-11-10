import { SearchParamsDashboard } from "@/types";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getOrdersByAdminWithCondition } from "@/lib/data-access/order";
import {
  SalesReportTable,
  SearchSalesReportForm,
} from "./searchSalesReportContent";

export default async function SalesReportPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsDashboard>;
}) {
  const params = await searchParams;

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

  // Ambil data
  const ordersPromise = getOrdersByAdminWithCondition({ where, limit, skip });

  const totalItems = await prisma.order.count({ where });
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Laporan Penjualan</h2>
        </div>
      </div>

      <SearchSalesReportForm ordersPromise={ordersPromise} params={params} />

      <SalesReportTable
        ordersPromise={ordersPromise}
        page={page}
        limit={limit}
        totalPages={totalPages}
      />
    </div>
  );
}
