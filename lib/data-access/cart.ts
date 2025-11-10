import { CartDTO, CartItemDTO, toCartDTO, toCartItemDTO } from "@/lib/dto/cart";
import prisma from "../prisma";
import { unstable_cache } from "next/cache";

export async function getCartByUser(userId: number) {
  return unstable_cache(
    async (): Promise<CartDTO | null> => {
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
        return null;
      }
      return toCartDTO(cart);
    },
    [`cart-${userId}`],
    { tags: ["cart"] }
  )();
}

export async function getCartItemsByIds(ids: number[]) {
  return unstable_cache(
    async (): Promise<CartItemDTO[]> => {
      if (!ids.length) return [];
      const items = await prisma.cartItem.findMany({
        where: { id: { in: ids } },
        include: { product: true },
        orderBy: { createdAt: "asc" },
      });

      return items.map(toCartItemDTO);
    },
    [`cart-${ids}`],
    { tags: ["cart"] }
  )();
}
