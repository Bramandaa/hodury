import prisma from "../prisma";
import { toCategoryDTO } from "../dto/category";
import { unstable_cache } from "next/cache";

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

// export function getCategoriesByAdminWithCondition({ skip, limit, where }) {
//   return unstable_cache(
//     async () => {
//       const categories = await prisma.category.findMany({
//         skip,
//         take: limit,
//         orderBy: { id: "asc" },
//         where,
//       });
//       return categories.map(toCategoryDTO);
//     },
//     [`category-${skip}-${limit}-${JSON.stringify(where)}`],
//     { tags: ["category"] }
//   )();
// }

// export async function getCategory(slug) {
//   const category = await prisma.category.findUnique({
//     where: { slug: slug },
//   });

//   return toCategoryDTO(category);
// }
