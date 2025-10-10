"use client";

import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmptyPage({ children, message, buttonMessage, href }) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
      {children}
      <p className="text-gray-500 max-w-sm">{message}</p>
      <Link href={href}>
        <Button>{buttonMessage}</Button>
      </Link>
    </div>
  );
}
