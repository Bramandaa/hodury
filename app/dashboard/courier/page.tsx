import { Button } from "@/components/ui/button";
import Link from "next/link";

import prisma from "@/lib/prisma";
import { AlertCard } from "@/components/alert";
import { SearchParamsDashboard } from "@/types";
import { Prisma } from "@prisma/client";
import { getCouriers } from "@/lib/data-access/user";
import { CourierTable, SearchCourierForm } from "./courierContent";

export default async function CourierPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsDashboard>;
}) {
  const params = await searchParams;
  const message = params.success;

  const newParams = new URLSearchParams(params);
  newParams.delete("success");
  const queryString = newParams.toString();

  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "5", 10);
  const skip = (page - 1) * limit;

  const keyword = params.keyword || "";

  const where: Prisma.UserWhereInput = { role: "COURIER" };

  if (keyword) {
    where.OR = [
      { name: { contains: keyword, mode: "insensitive" } },
      { phone: { contains: keyword, mode: "insensitive" } },
    ];
  }

  const couriersPromise = getCouriers({ skip, where, limit });

  const totalItems = await prisma.user.count({ where });
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Daftar Akun Kurir</h2>
          {message && <AlertCard />}
        </div>
        <Link href="/dashboard/courier/add">
          <Button className="bg-green-500 hover:bg-green-400 cursor-pointer">
            + Tambah Kurir
          </Button>
        </Link>
      </div>

      <SearchCourierForm params={params} />

      <CourierTable
        couriersPromise={couriersPromise}
        page={page}
        limit={limit}
        totalPages={totalPages}
        query={queryString}
      />
    </div>
  );
}
