import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { use } from "react";
import { OrderDTO } from "@/lib/dto/order";

export const formatRupiah = (value: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

export function getStatusBadge(status: string | undefined) {
  const baseClass = "text-white px-4 py-2";

  switch (status) {
    case "PENDING":
      return <Badge className={`bg-yellow-500 ${baseClass}`}>{status}</Badge>;
    case "PAID":
      return <Badge className={`bg-green-600 ${baseClass}`}>{status}</Badge>;
    case "SHIPPED":
      return <Badge className={`bg-blue-500 ${baseClass}`}>{status}</Badge>;
    case "COMPLETED":
      return <Badge className={`bg-emerald-600 ${baseClass}`}>{status}</Badge>;
    case "CANCELLED":
      return <Badge className={`bg-red-600 ${baseClass}`}>{status}</Badge>;
    default:
      return <Badge className={`bg-gray-400 ${baseClass}`}>{status}</Badge>;
  }
}

export default function DetailOrderDashboard({
  order,
  query,
}: {
  order: Promise<OrderDTO | null>;
  query: string;
}) {
  const orderData = use(order);

  return (
    <>
      {/* Order Info */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <p className="font-semibold">Invoice:</p>
            <p>{orderData?.invoiceNumber}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold">Status:</p>
            {getStatusBadge(orderData?.status)}
          </div>
          <div className="flex justify-between">
            <p className="font-semibold">Tanggal:</p>
            {orderData && (
              <p>
                {format(orderData?.createdAt, "dd MMMM yyyy, HH:mm", {
                  locale: id,
                })}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle>Data Customer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p>
            <span className="font-semibold">Nama:</span> {orderData?.user.name}
          </p>
          <p>
            <span className="font-semibold">Telepon:</span>{" "}
            {orderData?.user.phone}
          </p>
          <p>
            <span className="font-semibold">Alamat:</span>{" "}
            {orderData?.user.fullAddress}
          </p>
          <p className="text-sm text-muted-foreground">
            {orderData?.user.kecamatan}, {orderData?.user.kabupaten},{" "}
            {orderData?.user.provinsi}
          </p>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Produk Dipesan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData?.items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell
                      className="whitespace-normal wrap-break-word max-w-[200px]"
                      title={item.product.name}
                    >
                      {item.product.name}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatRupiah(item.price)}</TableCell>
                    <TableCell>
                      {formatRupiah(item.price * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>{formatRupiah(orderData?.subtotal ?? 0)}</p>
          </div>
          <div className="flex justify-between">
            <p>Ongkir</p>
            <p>{formatRupiah(orderData?.shippingFee ?? 0)}</p>
          </div>
          <div className="flex justify-between">
            <p>Service Fee</p>
            <p>{formatRupiah(orderData?.serviceFee ?? 0)}</p>
          </div>
          <div className="flex justify-between">
            <p>Handling Fee</p>
            <p>{formatRupiah(orderData?.handlingFee ?? 0)}</p>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <p>Total</p>
            <p>{formatRupiah(orderData?.total ?? 0)}</p>
          </div>
        </CardContent>
      </Card>

      <Link href={`/dashboard/order?${query}`} className="block">
        <Button variant="outline" className="w-full cursor-pointer">
          Kembali
        </Button>
      </Link>
    </>
  );
}
