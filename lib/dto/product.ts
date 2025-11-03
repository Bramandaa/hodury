import { Product, Category } from "@prisma/client";
import { toCategoryDTO } from "./category";

export function toProductDTO(product: Product & { category?: Category }) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    imageUrl: product.imageUrl,
    price: product.price,
    discountType: product.discountType,
    discount: product.discount,
    status: product.status,
    isFeatured: product.isFeatured,
    createdAt: product.createdAt,
    category: product.category ? toCategoryDTO(product.category) : undefined,
  };
}

export type ProductDTO = ReturnType<typeof toProductDTO>;

export function toProductDTOs(products: (Product & { category: Category })[]) {
  return products.map(toProductDTO);
}
