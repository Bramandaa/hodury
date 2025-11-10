"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { format } from "date-fns";
import midtransClient from "midtrans-client";

export async function payment({
  itemIds,
  total,
}: {
  itemIds: number[];
  total: number;
}) {
  const session = await verifySession();

  const user = await prisma.user.findUnique({ where: { id: session.userId } });

  const items = await prisma.cartItem.findMany({
    where: {
      id: { in: itemIds },
    },
    include: { product: true },
  });

  if (!process.env.MIDTRANS_SERVER_KEY || !process.env.MIDTRANS_CLIENT_KEY) {
    throw new Error("Missing Midtrans environment variables");
  }

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  });

  const itemDetails = [
    ...items.map((item) => ({
      id: `${item.id}-${item.product?.id}`,
      price: item.product?.price,
      quantity: item.quantity,
      name: item.product?.name,
    })),
    {
      id: "shipping-fee",
      price: 20000,
      quantity: 1,
      name: "Shipping Fee",
    },
    {
      id: "service-fee",
      price: 1000,
      quantity: 1,
      name: "Service Fee",
    },
    {
      id: "handling-fee",
      price: 1000,
      quantity: 1,
      name: "Handling Fee",
    },
  ];

  const today = format(new Date(), "yyyyMMdd"); // 20251002 misalnya

  let invoiceNumber;
  while (true) {
    const countToday = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    invoiceNumber = `INV-${today}-${(countToday + 1)
      .toString()
      .padStart(3, "0")}`;

    const exists = await prisma.order.findUnique({ where: { invoiceNumber } });
    if (!exists) break;
  }

  const parameter = {
    transaction_details: {
      order_id: invoiceNumber,
      gross_amount: total,
    },
    customer_details: {
      first_name: user?.name,
      phone: user?.phone,
      email: user?.email || undefined,
    },
    item_details: itemDetails,
  };

  const transaction = await snap.createTransaction(parameter);

  return {
    token: transaction.token,
    invoiceNumber,
  };
}
