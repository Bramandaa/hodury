"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDown } from "lucide-react";
import { StockReportData } from "./page";

export function SearchStockReportForm({ data }: { data: StockReportData }) {
  const router = useRouter();
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-25`;

    router.push(
      `?month=${month}&year=${year}&startDate=${startDate}&endDate=${endDate}`
    );
  };

  const exportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4");

    const monthName = months[month - 1]; // pakai months dari state di atas

    // Judul laporan
    doc.setFontSize(16);
    doc.text(`Laporan Stok Produk - ${monthName} ${year}`, 40, 30);

    // Tabel laporan
    autoTable(doc, {
      startY: 50,
      head: [["Produk", "Jumlah Pesanan"]],
      body: data.map((item) => [
        item.productName ?? "",
        item.totalOrder.toLocaleString("id-ID"),
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [52, 152, 219], halign: "center" },
      columnStyles: {
        1: { halign: "center" },
      },
    });

    // Nama file PDF juga ikut bulan & tahun
    const fileName = `laporan_stok_${monthName}_${year}.pdf`;
    doc.save(fileName);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex justify-between gap-4 bg-white border rounded-lg p-4 shadow-sm"
    >
      <div className="flex space-x-4">
        {/* Dropdown Bulan */}
        <div>
          <label className="block text-sm font-medium mb-1">Bulan</label>
          <Select
            value={String(month)}
            onValueChange={(v) => setMonth(Number(v))}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, i) => (
                <SelectItem key={i} value={String(i + 1)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Dropdown Tahun */}
        <div>
          <label className="block text-sm font-medium mb-1">Tahun</label>
          <Select
            value={String(year)}
            onValueChange={(v) => setYear(Number(v))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      </div>
      <div className="flex space-x-4">
        {/* Tombol Download */}
        <div className="flex items-end">
          <Button
            type="button"
            onClick={exportPDF}
            className="bg-red-500 hover:bg-red-500/80 cursor-pointer"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </form>
  );
}

export function StockReportTable({
  data,
  page,
  limit,
  totalPages,
}: {
  data: StockReportData;
  page: number;
  limit: number;
  totalPages: number;
}) {
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
            <th className="w-full text-left">Nama Produk</th>
            <th className="w-full text-center">Total Pesanan</th>
          </tr>
        </thead>
        <tbody>
          {data?.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="py-24 text-center text-gray-500 italic"
              >
                Kategori tidak ditemukan
              </td>
            </tr>
          ) : (
            data?.map((item, index) => (
              <tr
                key={item.productId}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-1.5">{(page - 1) * limit + index + 1}</td>
                <td className="py-1.5">{item.productName}</td>
                <td className="py-1.5 text-center">{item.totalOrder}</td>
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
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              className={`${
                p === page ? "bg-blue-500 hover:bg-blue-400 text-white" : ""
              } cursor-pointer`}
              onClick={() =>
                router.push(`?${createQueryString({ page: p, limit })}`)
              }
            >
              {p}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
