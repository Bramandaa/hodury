"use client";

import { use } from "react";
import { ReceiptText } from "lucide-react";
import EmptyItem from "@/components/emptyItem";
import OrderItem from "@/components/orderItem";
import { OrderDTO } from "@/lib/dto/order";

export default function OrderContent({
  orders,
}: {
  orders: Promise<OrderDTO[]>;
}) {
  const ordersData = use(orders);
  const steps = [
    { value: "PENDING", label: "Menunggu Pembayaran" },
    { value: "PAID", label: "Diproses" },
    { value: "SHIPPED", label: "Dikirim" },
    { value: "COMPLETED", label: "Selesai" },
  ];

  if (!ordersData || ordersData.length === 0) {
    return (
      <EmptyItem
        message={
          "Sepertinya kamu belum melakukan pemesanan apapun. Silakan kembali ke beranda"
        }
        buttonMessage={"Kembali ke beranda"}
        href={"/"}
      >
        <div className="p-6 rounded-full shadow-md">
          <ReceiptText className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-primary">
          Pesanan tidak ditemukan
        </h2>
      </EmptyItem>
    );
  }

  return (
    <>
      {ordersData.map((order) => {
        const stepLabel =
          steps.find((s) => s.value === order.status)?.label ?? order.status;

        return (
          <OrderItem
            key={order.invoiceNumber}
            order={order}
            stepLabel={stepLabel}
          />
        );
      })}
    </>
  );
}
