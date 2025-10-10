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

export const getProducstWithCondition = unstable_cache(
  async (where) => {
    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    await new Promise((res) => setTimeout(res, 2000));
    return toProductDTOs(products);
  },
  (where) => ["products-with-condition", JSON.stringify(where)],
  {
    revalidate: 60,
    tags: ["products"],
  }
);

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

export function getProduct(slugProduct) {
  return unstable_cache(
    async () => {
      const product = await prisma.product.findUnique({
        where: { slug: slugProduct },
        include: { category: true },
      });
      await new Promise((res) => setTimeout(res, 2000));
      return toProductDTO(product);
    },
    [`product-${slugProduct}`],
    { tags: ["product"] }
  )();
}
