import { CartDTO, toCartDTO } from "@/lib/dto/cart";
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
    ["cart"],
    { tags: ["cart"], revalidate: 1 }
  )();
}

// export function getCartByUser(userId: number) {
//   return getCachedCart(userId);
// }
