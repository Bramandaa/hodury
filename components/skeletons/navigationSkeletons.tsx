import { LogOut, ReceiptText, Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Session } from "@/lib/session";

export default function NavigationSkeletons({
  search,
  session,
}: {
  search: string;
  session: Session | null;
}) {
  return (
    <nav className="top-0 sticky bg-white shadow-sm z-50">
      <div className="flex items-center justify-between w-full max-w-5xl h-14 px-4 md:px-6 m-auto">
        <Link href="/" className="font-bold text-xl text-primary">
          Hodury
        </Link>
        <div className="hidden md:flex items-center rounded-md border border-gray-300 px-2 h-8 space-x-2">
          <Search className="w-4 text-gray-400" />
          <Input
            className="w-80 border-0 focus-visible:ring-0 p-0 text-primary"
            type="search"
            defaultValue={search}
            placeholder="Cari produk yang kamu inginkan"
          />
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {!session && (
            <Link href={"/cart"}>
              <div className="relative">
                <ShoppingCart className="h-6 text-gray-400 hover:text-primary cursor-pointer" />
              </div>
            </Link>
          )}

          <div className="w-0.5 h-6 bg-gray-200" />

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
                  <DropdownMenuItem className="text-red-500/60 focus:text-red-500 hover:text-red-500 focus:bg-red-50 hover:bg-red-50 cursor-pointer flex items-center gap-2 group">
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
      </div>
    </nav>
  );
}
