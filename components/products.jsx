import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { use } from "react";

export default function Products({ data }) {
  const ProductsData = use(data); // <-- pakai use() untuk Promise
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {ProductsData.map((item) => (
        <Link key={item.id} href={"/product/" + item.slug}>
          <Card className="w-full aspect-[4/6] shadow-sm hover:shadow-md transition overflow-hidden">
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
