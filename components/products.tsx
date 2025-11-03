import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { use } from "react";
import { Package } from "lucide-react";
import { ProductDTO } from "@/lib/dto/product";

export default function Products({ data }: { data: Promise<ProductDTO[]> }) {
  const ProductsData = use(data);

  if (!ProductsData) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-20 text-center text-muted-foreground">
        <div className="p-6 rounded-full shadow-sm mb-4 bg-muted">
          <Package className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-primary mb-1">
          Produk tidak ditemukan
        </h2>
        <p className="text-sm text-muted-foreground">
          Silakan coba kata kunci lain atau periksa kembali nanti.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {ProductsData.map((item) => (
        <Link key={item.id} href={`/product/${item.slug}`}>
          <Card className="w-full aspect-4/6 shadow-sm hover:shadow-md transition overflow-hidden">
            <CardContent className="p-2 flex flex-col h-full">
              <div className="relative w-full aspect-square flex items-center justify-center">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="100vh"
                  className="object-contain"
                />
              </div>
              <div className="mt-2 space-y-1 flex-1">
                <p className="text-sm truncate text-primary">{item.name}</p>
                <p className="text-sm font-bold text-primary">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
