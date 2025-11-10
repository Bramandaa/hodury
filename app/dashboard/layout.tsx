import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { verifySession } from "@/lib/session";
import { logout } from "@/action/auth";
import SidebarDashboard from "@/components/sidebarDashboard";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();

  if (
    session.role !== UserRole.ADMIN &&
    session.role !== UserRole.SUPER_ADMIN &&
    session.role !== UserRole.COURIER
  ) {
    redirect("/");
  }

  return (
    <div className="flex w-full h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarDashboard session={session} />
      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Navbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center z-50">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold text-primary">
              Hello, {"Admin"}!
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-6 w-6 border-2 border-primary focus-visible:ring-0 focus:outline-none cursor-pointer group"
                >
                  <User strokeWidth={3} className=" text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="font-medium w-48 p-2">
                <form action={logout}>
                  <button className="w-full">
                    <DropdownMenuItem className="text-red-500/60 focus:text-red-500 hover:text-red-500 focus:bg-red-50 hover:bg-red-50 cursor-pointer flex items-center gap-2 group">
                      <LogOut
                        className="h-4 w-4 group-focus:text-red-500"
                        strokeWidth={1.5}
                      />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
