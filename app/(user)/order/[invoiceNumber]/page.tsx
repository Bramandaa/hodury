import { getOrderByUser } from "@/lib/data-access/order";
import { Suspense } from "react";
import OrderDetailContent from "./orderDetailContent";
import { OrderDetailSkeleton } from "@/components/skeletons/orderDetailSkeleton";
import { getSession } from "@/lib/session";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ invoiceNumber: string }>;
}) {
  const { invoiceNumber } = await params;
  const session = await getSession();
  const orderPromise = getOrderByUser(invoiceNumber, session);

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-4">
      <h1 className="text-2xl font-bold">Detail Pesanan</h1>
      <Suspense fallback={<OrderDetailSkeleton />}>
        <OrderDetailContent orderPromise={orderPromise} />
      </Suspense>
    </section>
  );
}
