import { toCartDTO, toCartItemDTO } from "@/lib/dto/cart";
import prisma from "../prisma";

export async function getCartByUser(userId) {
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
}
