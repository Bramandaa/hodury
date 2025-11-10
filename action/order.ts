"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { OrderStatus } from "@prisma/client";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function CreateOrder({
  itemIds,
  subtotal,
  invoiceNumber,
}: {
  itemIds: number[];
  subtotal: number;
  invoiceNumber: string;
}) {
  const session = await verifySession();

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  const items = await prisma.cartItem.findMany({
    where: {
      id: { in: itemIds },
    },
    include: { product: true },
  });

  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: {
        user: { connect: { id: user?.id } },
        invoiceNumber,
        subtotal: subtotal,
        status: "PAID",
        total: subtotal + 22000,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: true },
    }),
    prisma.cartItem.deleteMany({
      where: { id: { in: itemIds } },
    }),
  ]);
  updateTag("order");
  redirect(`/order/${order.invoiceNumber}`);
}

export async function updateStatusOrderDashboard(
  invoiceNumber: string,
  status: OrderStatus,
  query: string
) {
  const session = await verifySession();

  if (session.role !== "ADMIN" && session.role !== "COURIER") {
    throw new Error("Forbidden");
  }

  try {
    await prisma.order.update({
      where: { invoiceNumber: invoiceNumber },
      data: { status },
    });
  } catch (error) {
    console.error("Gagal update status pesanan:", error);
    throw new Error("Gagal mengubah status pesanan");
  }
  updateTag("order");
  redirect(`/dashboard/order?${query}&success=Status Pesanan berhasil diubah`);
}
