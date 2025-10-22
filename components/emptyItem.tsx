"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyItemProps {
  children?: React.ReactNode;
  message: string;
  buttonMessage: string;
  href: string;
}

export default function EmptyItem({
  children,
  message,
  buttonMessage,
  href,
}: EmptyItemProps) {
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
