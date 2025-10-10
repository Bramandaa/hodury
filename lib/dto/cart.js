export function toCartItemDTO(cartItem) {
  if (!cartItem) return null;
  return {
    cartItemId: cartItem.id,
    quantity: cartItem.quantity,
    product: cartItem.product
      ? {
          productId: cartItem.product.id,
          name: cartItem.product.name,
          slug: cartItem.product.slug,
          price: cartItem.product.price,
          imageUrl: cartItem.product.imageUrl,
        }
      : null,
  };
}

export function toCartDTO(cart) {
  if (!cart) return null;
  return {
    cartId: cart.id,
    items: cart.items ? cart.items.map(toCartItemDTO) : [],
    // createdAt: cart.createdAt,
    // updatedAt: cart.updatedAt,
  };
}
