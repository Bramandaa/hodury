import { CartDTO, toCartDTO } from "@/lib/dto/cart";
import prisma from "../prisma";
import { unstable_cache } from "next/cache";

const getCachedCart = unstable_cache(
  async (userId: number): Promise<CartDTO | null> => {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!cart) {
      return { cartId: undefined, userId, items: [] };
    }
    return toCartDTO(cart);
  },
  ["cart"],
  { tags: ["cart"], revalidate: 30 }
);

export function getCartByUser(userId: number) {
  return getCachedCart(userId);
}
