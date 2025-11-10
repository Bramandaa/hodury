import { getOrderByAdmin } from "@/lib/data-access/order";
import { Suspense } from "react";
import DetailOrderDashboard from "./detailOrderDashboard";
import { verifySession } from "@/lib/session";
import OrderDashboardDetailSkeleton from "@/components/skeletons/orderDashboardDetailSkeleton";

export default async function OrderDetailPageDashboard({
  params,
}: {
  params: Promise<{
    invoiceNumber: string;
  }>;
}) {
  const { invoiceNumber } = await params;
  const queryString = new URLSearchParams(await params).toString();
  const session = await verifySession();
  const order = getOrderByAdmin(invoiceNumber, session);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Detail Pesanan</h2>
      <Suspense fallback={<OrderDashboardDetailSkeleton />}>
        <DetailOrderDashboard order={order} query={queryString} />
      </Suspense>
    </div>
  );
}
