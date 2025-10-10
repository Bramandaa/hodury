import { toOrderDTO } from "../dto/order";
import prisma from "../prisma";

export async function getOrdersByUser(userId) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return orders.map(toOrderDTO);
}

export async function getOrderByUser(invoiceNumber) {
  const order = await prisma.order.findUnique({
    where: { invoiceNumber: invoiceNumber },
    include: {
      user: true,
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) throw new Error("Order tidak ditemukan");

  return toOrderDTO(order);
}

export async function getOrdersByUserWithCondition({ where, include }) {
  const orders = await prisma.order.findMany({
    where,
    include,
    orderBy: { createdAt: "desc" },
  });

  return orders.map(toOrderDTO);
}
