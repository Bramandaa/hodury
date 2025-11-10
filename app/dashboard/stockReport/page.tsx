import { SearchParamsDashboard } from "@/types";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { SearchStockReportForm, StockReportTable } from "./stockReportContent";

export type StockReportData = {
  productId: number;
  productName: string | undefined;
  totalOrder: number;
}[];

export default async function StockReportPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsDashboard>;
}) {
  const params = await searchParams;

  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "5", 10);
  const skip = (page - 1) * limit;

  const year = Number(params.year) || new Date().getFullYear();
  const month = Number(params.month) || new Date().getMonth() + 1;

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month - 1, 25, 23, 59, 59);

  const allGrouped = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    where: {
      order: {
        status: OrderStatus.PAID,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
  });

  const totalItems = allGrouped.length;
  const totalPages = Math.ceil(totalItems / limit);

  const paginatedGrouped = allGrouped.slice(skip, skip + limit);

  const products = await prisma.product.findMany({
    where: { id: { in: paginatedGrouped.map((g) => g.productId) } },
  });

  const data = paginatedGrouped.map((g) => {
    const product = products.find((p) => p.id === g.productId);
    return {
      productId: g.productId,
      productName: product?.name,
      totalOrder: g._sum.quantity || 0,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Laporan Pesanan</h2>
        </div>
      </div>

      <SearchStockReportForm data={data} />

      <StockReportTable
        data={data}
        page={page}
        limit={limit}
        totalPages={totalPages}
      />
    </div>
  );
}
