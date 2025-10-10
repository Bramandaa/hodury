"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { revalidateTag } from "next/cache";

export async function addToCart(productId, quantity = 1) {
  const session = await verifySession();
  const userId = session.userId;

  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  // Upsert cart item berdasarkan cartId + productId
  await prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });

  revalidateTag("cart");
  return { success: true };
}

export async function updateCartQuantity(cartItemId, quantity) {
  const session = await verifySession();
  const userId = session.userId;

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart: { userId },
    },
  });

  if (!cartItem) throw new Error("Cart item tidak ditemukan");

  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  } else {
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  revalidateTag("cart");
  return { success: true };
}

export async function removeCartItem(cartItemId) {
  const session = await verifySession();
  const userId = session.userId;

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart: { userId },
    },
  });

  if (!cartItem) throw new Error("Cart item tidak ditemukan");

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  revalidateTag("cart");
  return { success: true };
}
