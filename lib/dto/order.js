import { toProductDTO } from "./product";
import { toUserAddressDTO } from "./user";

export function toOrderItemDTO(item) {
  return {
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
    product: item.product ? toProductDTO(item.product) : null,
  };
}

export function toOrderDTO(order) {
  return {
    userId: order.userId,
    orderId: order.id,
    invoiceNumber: order.invoiceNumber,
    status: order.status,
    total: order.total,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    serviceFee: order.serviceFee,
    handlingFee: order.handlingFee,
    createdAt: order.createdAt,
    user: order.user ? toUserAddressDTO(order.user) : null,
    items: order.items ? order.items.map(toOrderItemDTO) : [],
  };
}
