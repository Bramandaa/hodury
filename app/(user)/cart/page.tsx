import { Suspense } from "react";
import { CartContent } from "./cartContent";
import { getCartByUser } from "@/lib/data-access/cart";
import { getSession } from "@/lib/session";
import { CartSkeleton } from "@/components/skeletons/cartSkeleton";

export default async function CartPage() {
  const session = await getSession();
  const cartDataPromise = session?.userId
    ? getCartByUser(session.userId)
    : Promise.resolve(null);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-6">
      <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>

      <Suspense fallback={<CartSkeleton />}>
        <CartContent cartDataPromise={cartDataPromise} />
      </Suspense>
    </main>
  );
}
