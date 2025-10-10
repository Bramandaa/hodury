import Navigation from "@/components/navigation";
import { getCartByUser } from "@/lib/data-access/cart";
import { getSession } from "@/lib/session";

export default async function UserLayout({ children }) {
  const session = await getSession();
  const cartData = session?.userId ? await getCartByUser(session.userId) : [];
  return (
    <>
      <Navigation session={session} cartData={cartData} />
      {children}
    </>
  );
}
