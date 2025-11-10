import { Category, Product } from "@prisma/client";
import { ProductDTO, toProductDTO } from "./product";

export interface CategoryDTO {
  id: number;
  name: string;
  slug: string;
  products: Partial<ProductDTO>[];
}

export function toCategoryDTO(
  category: Category & { products?: Product[] }
): CategoryDTO {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    products:
      category.products?.map((p) => {
        const { ...rest } = toProductDTO(p);
        return rest;
      }) ?? [],
  };
}

export function toCategoriesDTOs(category: Category[]) {
  return category.map(toCategoryDTO);
}
