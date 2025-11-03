"use client";

import Link from "next/link";
import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingCart,
  User,
  LogOut,
  Search,
  ReceiptText,
  Menu,
  X,
} from "lucide-react";
import { logout } from "@/action/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { Session } from "@/lib/session";
import { CartDTO } from "@/lib/dto/cart";

export default function Navigation({
  session,
  cart,
}: {
  session: Session | null;
  cart: Promise<CartDTO | null>;
}) {
  const cartData = use(cart);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("search") ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsOpen(false);
    router.push(keyword !== "" ? `/?search=${keyword}` : "/");
  };

  return (
    <nav className="top-0 sticky bg-white shadow-sm z-50">
      <div className="flex items-center justify-between w-full max-w-5xl h-14 px-4 md:px-6 m-auto">
        <Link href="/" className="font-bold text-xl text-primary">
          Hodury
        </Link>
        <form onSubmit={handleSearch}>
          <div className="hidden md:flex items-center rounded-md border border-gray-300 px-2 h-8 space-x-2">
            <Search className="w-4 text-gray-400" />
            <Input
              className="w-80 border-0 focus-visible:ring-0 p-0 text-primary"
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Cari produk yang kamu inginkan"
            />
          </div>
        </form>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href={"/cart"}>
            <div className="relative">
              <ShoppingCart className="h-6 text-gray-400 hover:text-primary cursor-pointer" />
              {cartData && cartData?.items?.length > 0 && (
                <div className="absolute -top-2 -right-2.5 rounded-full bg-white p-0.5">
                  <div className="flex items-center justify-center bg-primary text-white font-medium aspect-square text-[10px] w-4 rounded-full">
                    {cartData?.items?.length}
                  </div>
                </div>
              )}
            </div>
          </Link>

          <div className="w-0.5 h-6 bg-gray-200" />

          {/* User */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-6 w-6 border-2 border-gray-400 hover:border-primary focus-visible:ring-0 focus:outline-none cursor-pointer group"
                >
                  <User
                    strokeWidth={3}
                    className="text-gray-400 group-hover:text-primary"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="font-medium w-48 p-2">
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-gray-400 focus:text-primary cursor-pointer group"
                  >
                    <User
                      className="h-4 w-4 group-focus:text-primary"
                      strokeWidth={1.5}
                    />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/order"
                    className="flex items-center gap-2 text-gray-400 focus:text-primary cursor-pointer group"
                  >
                    <ReceiptText
                      className="h-4 w-4 group-focus:text-primary"
                      strokeWidth={1.5}
                    />
                    <span>Pesanan</span>
                  </Link>
                </DropdownMenuItem>

                <button className="w-full">
                  <DropdownMenuItem
                    onClick={() => setOpenDialog(true)}
                    className="text-red-500/60 focus:text-red-500 hover:text-red-500 focus:bg-red-50 hover:bg-red-50 cursor-pointer flex items-center gap-2 group"
                  >
                    <LogOut
                      className="h-4 w-4 group-focus:text-red-500"
                      strokeWidth={1.5}
                    />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </button>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="bg-primary px-6 h-8 cursor-pointer">
                Login
              </Button>
            </Link>
          )}
        </div>

        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Yakin ingin logout?</AlertDialogTitle>
              <AlertDialogDescription>
                Kamu akan keluar dari akun ini dan perlu login kembali untuk
                mengakses fitur dan data pribadi. Pastikan semua aktivitasmu
                sudah selesai sebelum melanjutkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenDialog(false)}>
                Batal
              </AlertDialogCancel>
              <form className="w-full md:w-fit" action={logout}>
                <AlertDialogAction
                  className="w-full md:w-fit bg-red-600 hover:bg-red-500"
                  type="submit"
                >
                  <LogOut strokeWidth={3} />
                  Logout
                </AlertDialogAction>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-600 hover:text-primary"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-sm overflow-hidden">
          {/* Search */}
          <form onSubmit={handleSearch}>
            <div className="flex items-center border border-gray-300 mx-4 my-3 rounded-md px-2 h-9 space-x-2">
              <Search className="w-4 text-gray-400" />
              <Input
                className="w-full border-0 focus-visible:ring-0 p-0 text-primary"
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari produk..."
              />
            </div>
          </form>

          {/* Menu list */}
          <div className="flex flex-col bg-white">
            <Link
              href={"/cart"}
              className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-primary hover:bg-gray-50 active:bg-gray-100 border-b border-gray-200"
            >
              <ShoppingCart className="h-5" /> Keranjang
            </Link>

            {session && (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-primary hover:bg-gray-50 active:bg-gray-100 border-b border-gray-200"
                >
                  <User className="h-5" /> Profil
                </Link>

                <Link
                  href="/order"
                  className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-primary hover:bg-gray-50 active:bg-gray-100 border-b border-gray-200"
                >
                  <ReceiptText className="h-5" /> Pesanan
                </Link>

                <button
                  onClick={() => setOpenDialog(true)}
                  className="flex items-center gap-2 px-4 py-3 text-red-500 hover:text-red-600 hover:bg-red-50 active:bg-red-100 border-b border-gray-200 w-full text-left"
                >
                  <LogOut className="h-5" /> Logout
                </button>
              </>
            )}

            {!session && (
              <div className="px-4 py-3 cursor-pointer">
                <Link href="/login">
                  <Button className="w-full bg-primary h-9">Login</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
