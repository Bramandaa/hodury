import { toProductDTO, toProductDTOs } from "@/lib/dto/product";
import prisma from "../prisma";
import { unstable_cache } from "next/cache";

export const getActiveProducts = unstable_cache(
  async () => {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE", isFeatured: false },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return toProductDTOs(products);
  },
  ["active-products"],
  {
    tags: ["produk"],
  }
);

export async function getProducstWithCondition(where) {
  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return toProductDTOs(products);
}

export const getFeaturedProducts = unstable_cache(
  async () => {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE", isFeatured: true },
      include: { category: true },
      orderBy: { createdAt: "asc" },
    });

    return toProductDTOs(products);
  },
  ["featured-products"],
  { tags: ["produk"] }
);

export async function getProduct(slugProduct) {
  const product = await prisma.product.findUnique({
    where: { slug: slugProduct },
    include: { category: true },
  });

  return toProductDTO(product);
}
