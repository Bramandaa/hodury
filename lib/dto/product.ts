import { Product, Category } from "@prisma/client";

export interface ProductDTO {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  discountType: string | null;
  discount: number | null;
  status: string;
  isFeatured: boolean;
  createdAt: Date;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

export function toProductDTO(
  product: Product & { category?: Category }
): ProductDTO {
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
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        }
      : undefined,
  };
}

export function toProductDTOs(products: (Product & { category?: Category })[]) {
  return products.map(toProductDTO);
}
