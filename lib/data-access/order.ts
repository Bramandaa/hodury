import { unstable_cache } from "next/cache";
import prisma from "../prisma";
import { toOrderDTO, toOrderDTOs } from "../dto/order";
import { Session } from "../session";

export function getOrdersByUser(userId: number) {
  return unstable_cache(
    async () => {
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          user: true,
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return toOrderDTOs(orders);
    },
    [`order-${userId}`],
    { tags: ["order"] }
  )();
}

export function getOrderByUser(invoiceNumber: string, session: Session | null) {
  return unstable_cache(
    async () => {
      if (!session) return null;
      const order = await prisma.order.findUnique({
        where: { invoiceNumber },
        include: {
          user: true,
          items: {
            include: { product: true },
          },
        },
      });
      if (order?.user.id !== session.userId) return null;

      return toOrderDTO(order);
    },
    [`order-${invoiceNumber}`],
    { tags: ["order"] }
  )();
}

// export async function getOrdersByUserWithCondition({ where, include }) {
//   const orders = await prisma.order.findMany({
//     where,
//     include,
//     orderBy: { createdAt: "desc" },
//   });

//   return orders.map(toOrderDTO);
// }

// export function getOrdersByAdminWithCondition({ where, skip, limit }) {
//   return unstable_cache(
//     async () => {
//       const orders = await prisma.order.findMany({
//         skip,
//         take: limit,
//         where,
//         include: { user: true },
//         orderBy: { id: "asc" },
//       });
//       return orders.map(toOrderDTO);
//     },
//     [`orders-${skip}-${limit}-${JSON.stringify(where)}`],
//     { tags: ["order"] }
//   )();
// }
