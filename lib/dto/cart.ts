import { Cart, CartItem, Product } from "@prisma/client";
import { toProductDTO } from "./product";

export type CartItemDTO = {
  cartItemId: number;
  quantity: number;
  product: ReturnType<typeof toProductDTO> | null;
};

export function toCartItemDTO(
  cartItem: CartItem & { product: Product | null }
) {
  return {
    cartItemId: cartItem.id,
    quantity: cartItem.quantity,
    product: cartItem.product ? toProductDTO(cartItem.product) : null,
  };
}

export type CartDTO = {
  cartId: number;
  userId: number;
  items: ReturnType<typeof toCartItemDTO>[];
};

export function toCartDTO(
  cart: Cart & { items: (CartItem & { product: Product })[] }
) {
  return {
    cartId: cart.id,
    userId: cart.userId,
    items: cart.items ? cart.items.map(toCartItemDTO) : [],
  };
}
