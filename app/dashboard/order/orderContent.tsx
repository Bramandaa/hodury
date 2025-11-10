"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { use, useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { OrderDTO } from "@/lib/dto/order";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Spinner from "@/components/spinner";
import Link from "next/link";
import { Eye } from "lucide-react";
import { OrderStatus } from "@prisma/client";
import { updateStatusOrderDashboard } from "@/action/order";
import { SearchParamsDashboard } from "@/types";

export function SearchOrderForm({ params }: { params: SearchParamsDashboard }) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(params?.keyword || "");
  const [status, setStatus] = useState(params?.status || "all");
  const range =
    params?.startDate && params?.endDate
      ? {
          from: new Date(params.startDate),
          to: new Date(params.endDate),
        }
      : undefined;
  const [dateRange, setDateRange] = useState<DateRange | undefined>(range);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let query = `?keyword=${keyword}&status=${status}&page=1`;

    if (
      dateRange?.from instanceof Date &&
      !isNaN(dateRange.from.getTime()) &&
      dateRange?.to instanceof Date &&
      !isNaN(dateRange.to.getTime())
    ) {
      query += `&startDate=${format(
        dateRange.from,
        "yyyy-MM-dd"
      )}&endDate=${format(dateRange.to, "yyyy-MM-dd")}`;
    }

    router.push(query);
  };

  const formatRangeLabel = () => {
    if (
      !dateRange?.from ||
      !dateRange?.to ||
      !(dateRange.from instanceof Date) ||
      isNaN(dateRange.from.getTime()) ||
      !(dateRange.to instanceof Date) ||
      isNaN(dateRange.to.getTime())
    ) {
      return "Pilih Tanggal";
    }

    return `${format(dateRange.from, "dd MMM yyyy")} - ${format(
      dateRange.to,
      "dd MMM yyyy"
    )}`;
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row gap-4 bg-white border rounded-lg p-4 shadow-sm"
    >
      {/* Search Input */}
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">
          Apa yang ingin Anda cari?
        </label>
        <Input
          type="text"
          placeholder="Cari berdasarkan invoice, nama, dll"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Status */}
      <div className="w-full md:w-auto">
        <label className="block text-sm font-medium mb-1">Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Semua" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="PENDING">PENDING</SelectItem>
            <SelectItem value="PAID">PAID</SelectItem>
            <SelectItem value="SHIPPED">SHIPPED</SelectItem>
            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Range Picker */}
      <div className="w-full md:w-auto">
        <label className="block text-sm font-medium mb-1">Tanggal</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-[220px]">
              {formatRangeLabel()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Tombol Search */}
      <div className="flex items-end">
        <Button
          type="submit"
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 cursor-pointer"
        >
          Cari
        </Button>
      </div>
    </form>
  );
}

export function OrderTable({
  orders,
  page,
  limit,
  totalPages,
  query,
}: {
  orders: Promise<OrderDTO[]>;
  page: number;
  limit: number;
  totalPages: number;
  query: string;
}) {
  const dataOrders = use(orders);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);

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

  const handleChangeStatus = async (
    invoiceNumber: string,
    newStatus: OrderStatus
  ) => {
    if (!confirm(`Yakin ubah status pesanan ini menjadi ${newStatus}?`)) return;

    setLoadingStatus(invoiceNumber);

    startTransition(async () => {
      await updateStatusOrderDashboard(invoiceNumber, newStatus, query);
      setLoadingStatus(null);
    });
  };

  const statusOptions = (["PAID", "SHIPPED", "COMPLETED"] as OrderStatus[]).map(
    (status) => ({
      label: status,
      value: status,
    })
  );

  const StatusButton = ({
    item,
  }: {
    item: { invoiceNumber: string; status: OrderStatus };
  }) => {
    const isLoading = loadingStatus === item.invoiceNumber;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`
            ${
              item.status === "PENDING"
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : item.status === "PAID"
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : item.status === "SHIPPED"
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : item.status === "COMPLETED"
                ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                : item.status === "CANCELLED"
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : ""
            } w-28
          `}
          >
            {isLoading ? <Spinner /> : item.status}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {statusOptions.map((status) => (
            <DropdownMenuItem
              key={status.value}
              onClick={() =>
                handleChangeStatus(item.invoiceNumber, status.value)
              }
            >
              {status.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div>
      {/* Desktop: Table */}
      <div className="hidden md:block bg-white p-6 rounded-xl shadow overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              <th className="w-12 text-left">No</th>
              <th className="w-[30%] text-left">Invoice</th>
              <th className="w-[30%] text-left">Nama</th>
              <th className="w-[10%] text-left">Tanggal</th>
              <th className="w-[20%] text-center">Status</th>
              <th className="w-[10%] text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-24 text-center text-gray-500 italic"
                >
                  Pesanan tidak ditemukan
                </td>
              </tr>
            ) : (
              dataOrders.map((item, index) => (
                <tr
                  key={item.invoiceNumber}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-1.5">{(page - 1) * limit + index + 1}</td>
                  <td className="py-1.5">{item.invoiceNumber}</td>
                  <td className="py-1.5">{item.user.name}</td>
                  <td className="py-1.5">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-1.5 text-center">
                    <StatusButton item={item} />
                  </td>
                  <td className="py-1.5 text-center space-x-2">
                    <Link
                      href={`/dashboard/order/${item.invoiceNumber}?${query}`}
                    >
                      <Button
                        size="icon"
                        className="h-7 w-7 bg-gray-300 shadow-sm"
                      >
                        <Eye className="w-4 h-4 text-white" strokeWidth={2} />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: Card View */}
      <div className="space-y-4 md:hidden">
        {dataOrders.length === 0 ? (
          <p className="text-center text-gray-500 italic py-12">
            Kategori tidak ditemukan
          </p>
        ) : (
          dataOrders.map((item, index) => (
            <div key={item.invoiceNumber}>
              <div className="bg-white p-4 rounded-lg shadow border space-y-2 hover:bg-gray-50 transition">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    #{(page - 1) * limit + index + 1}
                  </span>
                  <StatusButton item={item} />
                </div>

                <p className="font-medium">Invoice: {item.invoiceNumber}</p>
                <p className="text-sm text-gray-600">Nama: {item.user.name}</p>
                <p className="text-sm text-gray-600">
                  Tanggal:{" "}
                  {new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <Link
                  href={"/dashboard/order/" + item.invoiceNumber}
                  className="block"
                >
                  <p className="text-right text-sm text-blue-600 font-medium">
                    Lihat Detail →
                  </p>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination & Limit Options (tetap sama untuk desktop & mobile) */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
        {/* Dropdown Limit */}
        <div className="flex items-center space-x-2">
          <span>Tampilkan:</span>
          <Select
            value={String(limit)}
            onValueChange={(val) =>
              router.push(`?${createQueryString({ page: 1, limit: val })}`)
            }
          >
            <SelectTrigger className="w-[100px] cursor-pointer bg-white">
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
