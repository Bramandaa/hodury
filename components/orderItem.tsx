import Link from "next/link";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { OrderDTO } from "@/lib/dto/order";

export default function OrderItem({
  order,
  stepLabel,
}: {
  order: OrderDTO;
  stepLabel: string;
}) {
  return (
    <Card className="shadow-sm rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">{order.invoiceNumber}</CardTitle>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Badge
          className="px-4 py-1.5"
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
          {stepLabel}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Total Belanja</span>
          <span className="font-semibold">
            Rp {order.total.toLocaleString("id-ID")}
          </span>
        </div>

        <Link href={`/order/${order.invoiceNumber}`}>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 cursor-pointer"
          >
            Lihat Detail
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
