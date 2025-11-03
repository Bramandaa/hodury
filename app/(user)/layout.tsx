import Navigation from "@/components/navigation";
import { getCartByUser } from "@/lib/data-access/cart";
import { getSession } from "@/lib/session";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const cartData = session?.userId
    ? getCartByUser(session.userId)
    : Promise.resolve(null);

  return (
    <>
      <Navigation session={session} search="" cart={cartData} />
      {children}
    </>
  );
}
