import { unstable_cache } from "next/cache";
import { toOrderDTO } from "../dto/order";
import prisma from "../prisma";

export function getOrdersByUser(userId) {
  return unstable_cache(
    async () => {
      const orders = await prisma.order.findMany({
        where: { userId },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
      return orders.map(toOrderDTO);
    },
    [`order-${userId}`],
    { tags: ["order"] }
  )();
}

export function getOrderByUser(invoiceNumber) {
  return unstable_cache(
    async () => {
      const order = await prisma.order.findUnique({
        where: { invoiceNumber: invoiceNumber },
        include: {
          user: true,
          items: {
            include: { product: true },
          },
        },
      });
      await new Promise((res) => setTimeout(res, 2000));
      return toOrderDTO(order);
    },
    [`order-${invoiceNumber}`],
    { tags: ["order"] }
  )();
}

export async function getOrdersByUserWithCondition({ where, include }) {
  const orders = await prisma.order.findMany({
    where,
    include,
    orderBy: { createdAt: "desc" },
  });

  return orders.map(toOrderDTO);
}

export function getOrdersByAdminWithCondition({ where, skip, limit }) {
  return unstable_cache(
    async () => {
      const orders = await prisma.order.findMany({
        skip,
        take: limit,
        where,
        include: { user: true },
        orderBy: { id: "asc" },
      });
      return orders.map(toOrderDTO);
    },
    [`orders-${skip}-${limit}-${JSON.stringify(where)}`],
    { tags: ["order"] }
  )();
}
