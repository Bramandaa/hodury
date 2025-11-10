"use client";

import { SessionPayload } from "@/lib/session";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function SidebarDashboard({
  session,
}: {
  session: SessionPayload;
}) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menus = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 1024 1024"
        >
          <path
            fill="currentColor"
            d="M1016.7 513.36L536.331 10.192a31.924 31.924 0 0 0-23.088-9.84a32.038 32.038 0 0 0-23.088 9.84L7.307 513.344c-12.24 12.752-11.808 32.992.944 45.248c12.752 12.224 32.992 11.872 45.248-.944l43.007-44.832v478.832c0 17.68 14.336 32 32 32h223.552c17.632 0 31.936-14.256 32-31.905l1.008-319.664h254.992v319.568c0 17.68 14.32 32 32 32H895.53c17.68 0 32-14.32 32-32V512.655l42.992 45.04a31.997 31.997 0 0 0 23.09 9.84c7.967 0 15.967-2.944 22.16-8.944c12.736-12.224 13.152-32.48.928-45.232zm-153.165-58.544v504.831H704.063V640.095c0-17.68-14.32-32-32-32h-318.88c-17.632 0-31.936 14.256-32 31.904l-1.008 319.664H160.511V454.815c0-2.64-.416-5.168-1.008-7.632L513.263 78.56l351.424 368.208c-.688 2.592-1.152 5.264-1.152 8.048z"
          />
        </svg>
      ),
    },
    {
      name: "Pesanan",
      href: "/dashboard/order",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 48 48"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="4"
          >
            <rect width="30" height="36" x="9" y="8" rx="2" />
            <path
              strokeLinecap="round"
              d="M18 4v6m12-6v6m-14 9h16m-16 8h12m-12 8h8"
            />
          </g>
        </svg>
      ),
    },
    {
      name: "Produk",
      href: "/dashboard/product",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 2048 2048"
        >
          <path
            fill="currentColor"
            d="m960 120l832 416v1040l-832 415l-832-415V536l832-416zm625 456L960 264L719 384l621 314l245-122zM960 888l238-118l-622-314l-241 120l625 312zM256 680v816l640 320v-816L256 680zm768 1136l640-320V680l-640 320v816z"
          />
        </svg>
      ),
      children: [
        {
          name: "Daftar Produk",
          href: "/dashboard/product",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
            >
              <path
                fill="currentColor"
                d="M1 4h2v2H1V4zm4 0h14v2H5V4zM1 9h2v2H1V9zm4 0h14v2H5V9zm-4 5h2v2H1v-2zm4 0h14v2H5v-2z"
              />
            </svg>
          ),
        },
        {
          name: "Kategori",
          href: "/dashboard/category",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M4 4h5v5H4zm-2 7V2h9v9zm2 4h5v5H4zm-2 7v-9h9v9zM20 4h-5v5h5zm-7-2v9h9V2zm2 13h5v5h-5zm-2 7v-9h9v9z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      name: "Kurir",
      href: "/dashboard/courier",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0m10 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
            <path d="M5 17H3V6a1 1 0 0 1 1-1h9v12m-4 0h6m4 0h2v-6h-8m0-5h5l3 5" />
          </g>
        </svg>
      ),
    },

    {
      name: "Banner",
      href: "/dashboard/banner",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M13 4h-2c-2.357 0-3.536 0-4.268.732S6 6.643 6 9v6c0 2.357 0 3.535.732 4.268S8.643 20 11 20h2c2.357 0 3.535 0 4.268-.732C18 18.535 18 17.357 18 15V9c0-2.357 0-3.536-.732-4.268C16.535 4 15.357 4 13 4M2 17.5A1.5 1.5 0 0 0 3.5 16V8A1.5 1.5 0 0 0 2 6.5m20 11a1.5 1.5 0 0 1-1.5-1.5V8A1.5 1.5 0 0 1 22 6.5"
            color="currentColor"
          />
        </svg>
      ),
    },
    {
      name: "Laporan",
      href: "/dashboard/report",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 16 16"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            d="M7.563 1.545H2.5v10.91h9V5.364M7.563 1.545L11.5 5.364M7.563 1.545v3.819H11.5m-7 9.136h9v-7M4 7.5h6M4 5h2m-2 5h6"
          />
        </svg>
      ),
      children: [
        {
          name: "Laporan Penjualan",
          href: "/dashboard/salesReport",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
            >
              <path
                fill="currentColor"
                d="M1 4h2v2H1V4zm4 0h14v2H5V4zM1 9h2v2H1V9zm4 0h14v2H5V9zm-4 5h2v2H1v-2zm4 0h14v2H5v-2z"
              />
            </svg>
          ),
        },
        {
          name: "Laporan Pesanan",
          href: "/dashboard/stockReport",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M4 4h5v5H4zm-2 7V2h9v9zm2 4h5v5H4zm-2 7v-9h9v9zM20 4h-5v5h5zm-7-2v9h9V2zm2 13h5v5h-5zm-2 7v-9h9v9z"
              />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-blue-600 shadow-md p-4 hidden md:block">
      <h1 className="text-2xl font-bold mb-6 text-white">Hodury</h1>
      <nav className="space-y-2">
        {menus
          .filter((menu) => {
            if (session?.role === "COURIER") {
              return menu.name === "Pesanan"; // hanya tampilkan menu Pesanan
            }
            return true; // selain courier tampilkan semua
          })
          .map((menu) => {
            const isActive = (() => {
              if (menu.children) {
                return menu.children.some((child) =>
                  pathname.startsWith(child.href)
                );
              }
              if (menu.href === "/dashboard") {
                return pathname === "/dashboard"; // dashboard strict
              }
              return pathname.startsWith(menu.href); // menu lain fleksibel
            })();

            return (
              <div
                key={menu.href}
                className={`${
                  openMenu === menu.name
                    ? "bg-white/10 text-white rounded-md space-y-2"
                    : ""
                }`}
              >
                {menu.children ? (
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === menu.name ? null : menu.name)
                    }
                    className={`flex w-full items-center justify-between gap-3 p-2 rounded-md font-medium transition-colors
            ${
              isActive
                ? "text-white bg-linear-to-r from-white/20 to-transparent"
                : "text-white hover:bg-white/10"
            }`}
                  >
                    <div className="flex items-center gap-3">
                      {menu.icon}
                      {menu.name}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-4 h-4 transform transition-transform ${
                        openMenu === menu.name ? "rotate-90" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  // menu tanpa child langsung pakai Link
                  <Link
                    href={menu.href}
                    className={`flex items-center gap-3 p-2 rounded-md font-medium transition-colors
            ${
              isActive
                ? "text-white bg-linear-to-r from-white/20 to-transparent"
                : "text-white hover:bg-white/10"
            }`}
                  >
                    {menu.icon}
                    {menu.name}
                  </Link>
                )}

                {/* Submenu */}
                {menu.children && openMenu === menu.name && (
                  <div className="space-y-1 font-medium ">
                    {menu.children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center gap-3 p-2 rounded-md transition-colors
            ${childActive ? "text-white" : "text-white/50 hover:text-white"}`}
                        >
                          {child.icon}
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </nav>
    </aside>
  );
}
