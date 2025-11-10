import { getCartItemsByIds } from "@/lib/data-access/cart";
import CheckoutContent from "./checkoutContent";
import { verifySession } from "@/lib/session";
import { getAddress } from "@/lib/data-access/user";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ items: string }>;
}) {
  const ids = (await searchParams).items.split(",").map(Number);
  const session = await verifySession();
  const itemsPromise = getCartItemsByIds(ids);
  const addressPromise = session && getAddress(session?.userId);
  return (
    <>
      <CheckoutContent
        itemIds={ids}
        itemsPromise={itemsPromise}
        addressPromise={addressPromise}
      />
    </>
  );
}
