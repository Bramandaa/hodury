"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { use, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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
import { Eye, FileDown } from "lucide-react";
import { OrderDTO } from "@/lib/dto/order";
import Link from "next/link";
import { DateRange } from "react-day-picker";
import { SearchParamsDashboard } from "@/types";

export function SearchSalesReportForm({
  ordersPromise,
  params,
}: {
  ordersPromise: Promise<OrderDTO[]>;
  params: SearchParamsDashboard;
}) {
  const orders = use(ordersPromise);
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
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

  const exportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4");

    doc.setFontSize(16);
    doc.text("Laporan Order", 40, 30);

    autoTable(doc, {
      startY: 50,
      head: [
        [
          "Invoice",
          "Tanggal",
          "Customer",
          "Phone",
          "Subtotal",
          "Ongkir",
          "Service",
          "Handling",
          "Total",
          "Status",
        ],
      ],
      body: orders.map((item) => [
        item.invoiceNumber,
        new Date(item.createdAt).toLocaleDateString("id-ID"),
        item.user?.name || "-",
        item.user?.phone || "-",
        item.subtotal?.toLocaleString("id-ID") || "0",
        (item.shippingFee ?? 20000).toLocaleString("id-ID"),
        (item.serviceFee ?? 1000).toLocaleString("id-ID"),
        (item.handlingFee ?? 1000).toLocaleString("id-ID"),
        item.total?.toLocaleString("id-ID") || "0",
        item.status,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [52, 152, 219] },
    });

    // ✅ Fix: terima Date atau string, dan aman dari Invalid Date
    const formatDate = (date: string | Date) => {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "invalid-date";
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;
    };

    // ✅ Ambil dari params dengan fallback aman
    const start = params?.startDate ? new Date(params.startDate) : undefined;
    const end = params?.endDate ? new Date(params.endDate) : undefined;

    let fileName = "laporan_order.pdf";

    if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
      fileName = `laporan_order_${formatDate(start)}_sampai_${formatDate(
        end
      )}.pdf`;
    } else if (start && !isNaN(start.getTime())) {
      fileName = `laporan_order_${formatDate(start)}_sampai_all.pdf`;
    } else if (end && !isNaN(end.getTime())) {
      fileName = `laporan_order_all_sampai_${formatDate(end)}.pdf`;
    } else {
      const today = formatDate(new Date());
      fileName = `laporan_order_${today}.pdf`;
    }

    doc.save(fileName);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex gap-4 bg-white border rounded-lg p-4 shadow-sm"
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
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[150px]">
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
      <div>
        <label className="block text-sm font-medium mb-1">Tanggal</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[220px]">
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
          className="bg-blue-600 hover:bg-blue-500 cursor-pointer"
        >
          Cari
        </Button>
      </div>
      <div className="flex items-end">
        <Button
          type="button"
          onClick={exportPDF}
          className="bg-red-500 hover:bg-red-500/80 cursor-pointer"
        >
          <FileDown />
          Download
        </Button>
      </div>
    </form>
  );
}

export function SalesReportTable({
  ordersPromise,
  page,
  limit,
  totalPages,
}: {
  ordersPromise: Promise<OrderDTO[]>;
  page: number;
  limit: number;
  totalPages: number;
}) {
  const orders = use(ordersPromise);
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

  return (
    <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
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
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="py-24 text-center text-gray-500 italic"
              >
                Kategori tidak ditemukan
              </td>
            </tr>
          ) : (
            orders.map((item, index) => (
              <tr
                key={item.orderId}
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
                    {item.status}
                  </Button>
                </td>

                {/* Actions */}
                <td className="py-1.5 text-center space-x-2">
                  <Link href={"/dashboard/order/" + item.invoiceNumber}>
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
      {/* Pagination & Limit Options */}
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

          {(() => {
            const visiblePages = 3;
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
