"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { use, useState } from "react";
import { CategoryDTO } from "@/lib/dto/category";
import { SearchParamsDashboard } from "@/types";
import { ProductDTO } from "@/lib/dto/product";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProduct, updateProductStatus } from "@/action/product";
import { ProductStatus } from "@prisma/client";

export function SearchProductForm({
  categoriesPromise,
  params,
}: {
  categoriesPromise: Promise<CategoryDTO[]>;
  params: SearchParamsDashboard;
}) {
  const categoriesData = use(categoriesPromise);
  const router = useRouter();
  const [keyword, setKeyword] = useState(params?.keyword || "");
  const [category, setCategory] = useState(params?.category || "all");
  const [status, setStatus] = useState(params?.status || "all");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(
      `?keyword=${keyword}&category=${category}&status=${status}&page=1`
    );
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex gap-4 bg-white border rounded-lg p-4 shadow-sm"
    >
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">
          Apa yang ingin Anda cari?
        </label>
        <Input
          type="text"
          placeholder="Cari berdasarkan nama, harga, dll"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Kategori</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Semua" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            {categoriesData.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Semua" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="ACTIVE">Aktif</SelectItem>
            <SelectItem value="INACTIVE">Nonaktif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 cursor-pointer"
        >
          Cari
        </Button>
      </div>
    </form>
  );
}

export function ProductTable({
  productsPromise,
  page,
  limit,
  totalPages,
  query,
}: {
  productsPromise: Promise<ProductDTO[] | null>;
  page: number;
  limit: number;
  totalPages: number;
  query: string;
}) {
  const products = use(productsPromise);
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = (
    updates: Record<string, string | number | boolean | null | undefined>
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    return params.toString();
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleChangeStatus = async (id: number, newStatus: ProductStatus) => {
    if (!confirm(`Yakin ubah status produk ini menjadi ${newStatus}?`)) return;

    await updateProductStatus(id, newStatus, query);
  };

  const handleEdit = (slug: string) => {
    router.push(`/dashboard/product/${slug}?${query}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus produk ini?")) return;
    await deleteProduct(id, query);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            <th className="w-12 text-left">No</th>
            <th className="w-[30%] text-left">Nama</th>
            <th className="w-[30%] text-left">Kategori</th>
            <th className="w-[15%] text-left">Harga</th>
            <th className="w-[13%] text-center">Status</th>
            <th className="w-[10%] text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products?.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="py-24 text-center text-gray-500 italic"
              >
                Produk tidak ditemukan
              </td>
            </tr>
          ) : (
            products?.map((p, index) => (
              <tr
                key={p.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-1.5">{(page - 1) * limit + index + 1}</td>
                <td className="py-1.5 truncate max-w-[250px]">{p.name}</td>
                <td className="py-1.5">{p.category?.name}</td>
                <td className="py-1.5">{formatRupiah(p.price)}</td>

                {/* Dropdown Status */}
                <td className="py-1.5 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={
                          p.status === "ACTIVE"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }
                      >
                        {p.status === "ACTIVE" ? "AKTIF" : "NONAKTIF"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleChangeStatus(p.id, "ACTIVE")}
                      >
                        Aktif
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleChangeStatus(p.id, "INACTIVE")}
                      >
                        Nonaktif
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>

                {/* Actions */}
                <td className="py-1.5 text-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleEdit(p.slug)}
                  >
                    <Pencil className="w-4 h-4 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Pagination & Limit Options */}
      <div className="flex justify-between items-center mt-4">
        {/* Dropdown Limit pakai shadcn */}
        <div className="flex items-center space-x-2">
          <span>Tampilkan:</span>
          <Select
            value={String(limit)}
            onValueChange={(val) =>
              router.push(`?${createQueryString({ page: 1, limit: val })}`)
            }
          >
            <SelectTrigger className="w-[100px] cursor-pointer">
              <SelectValue placeholder="Pilih limit" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((val) => (
                <SelectItem key={val} value={String(val)}>
                  {val}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center space-x-1">
          {/* Tombol Previous */}
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() =>
              router.push(`?${createQueryString({ page: page - 1, limit })}`)
            }
          >
            Prev
          </Button>

          {/* Dinamis Pages */}
          {(() => {
            const visiblePages = 3; // jumlah maksimal halaman yang ditampilkan
            let start = Math.max(1, page - Math.floor(visiblePages / 2));
            const end = Math.min(totalPages, start + visiblePages - 1);

            if (end - start < visiblePages - 1) {
              start = Math.max(1, end - visiblePages + 1);
            }

            const pages = [];
            if (start > 1) pages.push(1);
            if (start > 2) pages.push("left-ellipsis");

            for (let i = start; i <= end; i++) pages.push(i);

            if (end < totalPages - 1) pages.push("right-ellipsis");
            if (end < totalPages) pages.push(totalPages);

            return pages.map((p, i) =>
              typeof p === "number" ? (
                <Button
                  key={i}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  className={`${
                    p === page ? "bg-blue-500 hover:bg-blue-400 text-white" : ""
                  } cursor-pointer`}
                  onClick={() =>
                    router.push(`?${createQueryString({ page: p, limit })}`)
                  }
                >
                  {p}
                </Button>
              ) : (
                <span key={i} className="px-2 text-gray-500">
                  …
                </span>
              )
            );
          })()}

          {/* Tombol Next */}
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() =>
              router.push(`?${createQueryString({ page: page + 1, limit })}`)
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
