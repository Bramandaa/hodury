"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export function AlertCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get("success");

  if (!message) return null;

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("success");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Alert className="flex items-center justify-between gap-3 border-green-500 bg-green-50 text-green-700">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <div>
          <AlertTitle>Berhasil!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-green-700 hover:text-green-900"
        onClick={handleClose}
      >
        <X className="h-4 w-4 text-red-500" />
      </Button>
    </Alert>
  );
}
