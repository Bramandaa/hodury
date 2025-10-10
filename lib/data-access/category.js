import prisma from "../prisma";
import { toCategoryDTO } from "../dto/category";

export async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
  });

  return toCategoryDTO(categories);
}

export async function getCategory(slug) {
  const category = await prisma.category.findUnique({
    where: { slug: slug },
  });

  return toCategoryDTO(category);
}
