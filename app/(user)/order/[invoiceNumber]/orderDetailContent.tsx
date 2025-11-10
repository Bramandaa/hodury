import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, Package, Phone, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { use } from "react";
import { OrderDTO } from "@/lib/dto/order";

export default function OrderDetailContent({
  orderPromise,
}: {
  orderPromise: Promise<OrderDTO | null>;
}) {
  const order = use(orderPromise);
  const steps = [
    { value: "PENDING", label: "Menunggu Pembayaran", icon: Clock },
    { value: "PAID", label: "Diproses", icon: Package },
    { value: "SHIPPED", label: "Dikirim", icon: Truck },
    { value: "COMPLETED", label: "Selesai", icon: CheckCircle },
  ];
  const currentStepIndex = steps.findIndex((s) => s.value === order?.status);

  const currentStep = steps.find((s) => s.value === order?.status)?.label ?? "";

  if (!order) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold">Pesanan tidak ditemukan</h2>
        <Link href="/order">
          <Button className="mt-4">Kembali ke Pesanan</Button>
        </Link>
      </section>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{order.invoiceNumber}</CardTitle>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <Badge
            className="px-4 py-2"
            variant={
              order.status === "PAID"
                ? "default"
                : order.status === "PENDING"
                ? "secondary"
                : order.status === "CANCELLED"
                ? "destructive"
                : "outline"
            }
          >
            {currentStep}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <Separator />
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-sm">
              <span>Ongkos Kirim</span>
              <span>Rp {order?.shippingFee?.toLocaleString("id-ID")}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Biaya Jasa</span>
              <span>Rp {order?.serviceFee?.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Biaya Layanan</span>
              <span>Rp {order?.handlingFee?.toLocaleString("id-ID")}</span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between text-sm font-semibold">
            <span>Total Belanja</span>
            <span>Rp {order.total.toLocaleString("id-ID")}</span>
          </div>
        </CardContent>
      </Card>

      {/* Progress Status */}
      {order.status !== "CANCELLED" && (
        <Card>
          <CardHeader>
            <CardTitle>Status Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between relative">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index <= currentStepIndex;

                return (
                  <div
                    key={step.label}
                    className="flex-1 flex flex-col items-center relative"
                  >
                    {/* Icon Step */}
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors z-10 ${
                        isActive
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-400 border-gray-300"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {/* Label */}
                    <span
                      className={`mt-2 text-xs text-center ${
                        isActive ? "text-primary font-medium" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                    {/* Garis penghubung */}
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute top-5 left-1/2 w-full h-0.5 ${
                          index < currentStepIndex
                            ? "bg-primary"
                            : "bg-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informasi Pengiriman</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1 capitalize">
          <div className="flex-1">
            <div className="font-medium">Alamat:</div>
            <div className="">{order.user.name}</div>
            <div className="text-xs capitalize">
              {order.user.fullAddress},{" "}
              <div>
                {order.user.kecamatan},{" " + order.user.kabupaten},
                {" " + order.user.provinsi}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Phone size={12} className="text-primary" />
              <span>{order.user.phone}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      {order?.status == "PENDING" && (
        <Link href={"/checkout/" + order.invoiceNumber} className="block">
          <Button className="w-full cursor-pointer">Bayar</Button>
        </Link>
      )}
      <Link href="/order" className="block">
        <Button variant="outline" className="w-full cursor-pointer">
          Kembali
        </Button>
      </Link>
    </>
  );
}
