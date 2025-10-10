import { toCartDTO, toCartItemDTO } from "@/lib/dto/cart";
import prisma from "../prisma";
import { unstable_cache } from "next/cache";

export function getCartByUser(userId) {
  return unstable_cache(
    async () => {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: { product: true },
            orderBy: { createdAt: "asc" },
          },
        },
      });
      return toCartDTO(cart);
    },
    [`cart-${userId}`],
    { tags: ["cart"] }
  )();
}
