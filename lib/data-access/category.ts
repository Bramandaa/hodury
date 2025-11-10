import prisma from "../prisma";
import { CategoryDTO, toCategoryDTO } from "../dto/category";
import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";

export const getCategories = unstable_cache(
  async () => {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });

    return categories.map(toCategoryDTO);
  },
  ["category"],
  { tags: ["category"] }
);

export function getCategoriesByAdminWithCondition({
  skip,
  limit,
  where,
}: {
  skip: number;
  limit: number;
  where: Prisma.CategoryWhereInput;
}) {
  return unstable_cache(
    async () => {
      const categories = await prisma.category.findMany({
        skip,
        take: limit,
        orderBy: { id: "asc" },
        where,
      });
      return categories.map(toCategoryDTO);
    },
    [`category-${skip}-${limit}-${JSON.stringify(where)}`],
    { tags: ["category"] }
  )();
}

export function getCategory(slug: string) {
  return unstable_cache(async (): Promise<CategoryDTO | null> => {
    const category = await prisma.category.findUnique({
      where: { slug: slug },
      include: { products: true },
    });
    if (!category) return null;
    return toCategoryDTO(category);
  })();
}
