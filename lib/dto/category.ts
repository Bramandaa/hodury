import { Category } from "@prisma/client";

export function toCategoryDTO(category: Category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
  };
}

export type CategoryDTO = ReturnType<typeof toCategoryDTO>;

export function toCategoriesDTOs(category: Category[]) {
  return category.map(toCategoryDTO);
}
