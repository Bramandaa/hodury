"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { format } from "date-fns";
import midtransClient from "midtrans-client";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function checkoutCart({ userId, cartItemIds }) {
  const session = await verifySession();

  if (!cartItemIds || cartItemIds.length === 0) {
    throw new Error("Tidak ada item yang dipilih untuk checkout");
  }

  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!cart) throw new Error("Cart user tidak ditemukan");

  const selectedItems = await prisma.cartItem.findMany({
    where: {
      id: { in: cartItemIds },
      cartId: cart.id,
    },
    include: { product: true },
  });

  if (selectedItems.length === 0) {
    throw new Error("Item tidak ditemukan");
  }

  const subtotal = selectedItems.reduce((acc, item) => {
    return acc + item.quantity * item.product.price;
  }, 0);

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
    if (!exists) break; // unik, keluar loop
  }

  // Jalankan transaksi atomik
  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        invoiceNumber,
        subtotal: subtotal,
        total: subtotal + 22000,
        items: {
          create: selectedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: true },
    }),
    prisma.cartItem.deleteMany({
      where: { id: { in: cartItemIds } },
    }),
  ]);
  revalidateTag("cart");
  return { orderId: order.id, subtotal, invoiceNumber };
}

export async function payment(orderId) {
  await verifySession();

  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  });

  const itemDetails = [
    ...order.items.map((item) => ({
      id: `${order.id}-${item.productId}`,
      price: item.price,
      quantity: item.quantity,
      name: item.product.name,
    })),
    ...(order.shippingFee
      ? [
          {
            id: `${order.id}-SHIPPING`,
            price: order.shippingFee,
            quantity: 1,
            name: "Ongkos Kirim",
          },
        ]
      : []),
    ...(order.serviceFee
      ? [
          {
            id: `${order.id}-SERVICE`,
            price: order.serviceFee,
            quantity: 1,
            name: "Biaya Layanan",
          },
        ]
      : []),
    ...(order.handlingFee
      ? [
          {
            id: `${order.id}-HANDLING`,
            price: order.handlingFee,
            quantity: 1,
            name: "Biaya Jasa",
          },
        ]
      : []),
  ];

  const parameter = {
    transaction_details: {
      order_id: order.invoiceNumber,
      gross_amount: order.total,
    },
    customer_details: {
      first_name: order.user.name,
      phone: order.user.phone,
      email: order.user.email || undefined,
    },
    item_details: itemDetails,
  };

  const transaction = await snap.createTransaction(parameter);

  return {
    token: transaction.token,
    redirect_url: transaction.redirect_url,
  };
}

export async function updateStatusOrder(invoiceNumber) {
  const session = await verifySession();

  await prisma.order.update({
    where: { invoiceNumber: invoiceNumber },
    data: {
      status: "PAID",
    },
  });
  revalidateTag("order");
  redirect("/order/" + invoiceNumber);
}
