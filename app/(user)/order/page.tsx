import { OrderItemSkeleton } from "@/components/skeletons/orderItemSkeleton";
import { getOrdersByUser } from "@/lib/data-access/order";
import { verifySession } from "@/lib/session";
import { Suspense } from "react";
import OrderContent from "./orderContent";

export default async function OrderPage() {
  const session = await verifySession();
  const orders = getOrdersByUser(session.userId);

  return (
    <>
      <section className="max-w-3xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-4">
        <h1 className="text-2xl font-bold">Riwayat Pesanan</h1>

        <Suspense
          fallback={
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <OrderItemSkeleton key={i} />
              ))}
            </div>
          }
        >
          <OrderContent orders={orders} />
        </Suspense>
      </section>
    </>
  );
}
