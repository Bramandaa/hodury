import { toCategoryDTO } from "./category";

export function toProductDTO(product) {
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

export function toProductDTOs(products) {
  return products.map(toProductDTO);
}
