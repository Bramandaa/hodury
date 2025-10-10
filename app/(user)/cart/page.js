import { getCartByUser } from "@/lib/data-access/cart";
import { CartContent } from "./cartContent";
import { getSession } from "@/lib/session";

export default async function CartPage() {
  const session = await getSession();

  const cartData = session?.userId ? await getCartByUser(session.userId) : null;

  return (
    <>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-4">
        <h1 className="font-semibold text-xl capitalize">Keranjang</h1>
        <CartContent cartData={cartData?.items} session={session} />
      </section>
    </>
  );
}
