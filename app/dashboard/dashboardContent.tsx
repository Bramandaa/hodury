"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Aktivitas, OrderStatusData, Produk, SalesData } from "./page";

export default function DashboardContent({
  totalPenjualan,
  jumlahPesanan,
  jumlahPelanggan,
  ordersByStatus,
  salesData,
  produkTerlaris,
  aktivitas,
}: {
  totalPenjualan: number;
  jumlahPesanan: number;
  jumlahPelanggan: number;
  ordersByStatus: OrderStatusData[];
  salesData: SalesData[];
  produkTerlaris: Produk[];
  aktivitas: Aktivitas[];
}) {
  return (
    <div className="grid gap-6">
      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex space-x-4 items-center bg-white p-4 rounded-xl shadow">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-primary"
              viewBox="0 0 21 21"
            >
              <g
                fill="none"
                fillRule="evenodd"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4.5 3.5v11a2 2 0 0 0 2 2h11" />
                <path d="m6.5 12.5l3-3l2 2l5-5" />
                <path d="M16.5 9.5v-3h-3" />
              </g>
            </svg>
          </div>
          <div>
            <h3 className="text-gray-500">Total Penjualan</h3>
            <p className="text-2xl font-bold text-primary">
              Rp {totalPenjualan.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10"
              viewBox="0 0 48 48"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2.5"
              >
                <rect width="30" height="36" x="9" y="8" rx="2" />
                <path
                  strokeLinecap="round"
                  d="M18 4v6m12-6v6m-14 9h16m-16 8h12m-12 8h8"
                />
              </g>
            </svg>
          </div>
          <div>
            <h3 className="text-gray-500">Jumlah Pesanan</h3>
            <p className="text-2xl font-bold text-primary">{jumlahPesanan}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2m1-17.87a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-gray-500">Jumlah Pelanggan</h3>
            <p className="text-2xl font-bold text-primary">{jumlahPelanggan}</p>
          </div>
        </div>
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-primary">
            Jumlah Pesanan per Bulan
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pesanan" fill="#155dfc" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-primary">
            Distribusi Status Pesanan
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ordersByStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {ordersByStatus.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      ["#155dfc", "#00C49F", "#FFBB28", "#FF8042", "#d32f2f"][
                        index % 5
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-primary">
            Produk Terlaris
          </h3>
          <ul className="space-y-3">
            {produkTerlaris.map((p) => (
              <li key={p.id} className="flex justify-between text-primary">
                <span>{p.nama}</span>
                <span className="font-semibold">{p.terjual} terjual</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Aktivitas Terbaru */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-primary">
            Aktivitas Terbaru
          </h3>
          <ul className="space-y-3">
            {aktivitas.map((a) => (
              <li
                key={a.id}
                className="flex justify-between text-sm text-primary"
              >
                <span>
                  {a.pesan} ({a.invoice})
                </span>
                <span className="text-gray-500">{a.waktu}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
