import { Order, OrderItem, Product, User } from "@prisma/client";
import { toProductDTO } from "./product";
import { toUserAddressDTO } from "./user";

export function toOrderItemDTO(item: OrderItem & { product: Product }) {
  return {
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
    product: toProductDTO(item.product),
  };
}

export function toOrderDTO(
  order: Order & { items: (OrderItem & { product: Product })[] } & {
    user: User;
  }
) {
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
    user: toUserAddressDTO(order.user),
    items: order.items.map(toOrderItemDTO),
  };
}

export type OrderDTO = ReturnType<typeof toOrderDTO>;

export function toOrderDTOs(
  orders: (Order & { items: (OrderItem & { product: Product })[] } & {
    user: User;
  })[]
) {
  return orders.map(toOrderDTO);
}
