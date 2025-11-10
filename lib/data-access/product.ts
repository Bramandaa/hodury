import { ProductDTO, toProductDTO, toProductDTOs } from "@/lib/dto/product";
import prisma from "../prisma";
import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";

export const getActiveProducts = unstable_cache(
  async (): Promise<ProductDTO[]> => {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE", isFeatured: false },
      include: { category: true },
      orderBy: { createdAt: "asc" },
    });
    return toProductDTOs(products);
  },
  ["active-products"],
  { tags: ["product"] }
);

export const getFeaturedProducts = unstable_cache(
  async (): Promise<ProductDTO[]> => {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE", isFeatured: true },
      include: { category: true },
      orderBy: { createdAt: "asc" },
    });
    return toProductDTOs(products);
  },
  ["featured-products"],
  { tags: ["product"] }
);

export function getProductsWithCondition(where: Prisma.ProductWhereInput) {
  return unstable_cache(
    async (where: Prisma.ProductWhereInput): Promise<ProductDTO[]> => {
      const products = await prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
      });
      return toProductDTOs(products);
    },
    [`products-with-condition-${JSON.stringify(where)}`],
    {
      tags: ["product"],
      revalidate: 60,
    }
  )(where);
}

export async function getProduct(slugProduct: string) {
  return unstable_cache(
    async (): Promise<ProductDTO | null> => {
      const product = await prisma.product.findUnique({
        where: { slug: slugProduct },
        include: { category: true },
      });

      if (!product) return null;
      return toProductDTO(product);
    },
    [`product-${slugProduct}`],
    { tags: ["product"] }
  )();
}

export async function getProductsByAdminWithCondition({
  skip,
  limit,
  where,
}: {
  skip: number;
  limit: number;
  where: Prisma.ProductWhereInput;
}) {
  return unstable_cache(
    async (): Promise<ProductDTO[] | null> => {
      const products = await prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { id: "asc" },
        where,
        include: {
          category: true,
        },
      });
      if (!products) return null;
      return toProductDTOs(products);
    },
    [`products-${skip}-${limit}-${JSON.stringify(where)}`],
    { tags: ["product"] }
  )();
}
