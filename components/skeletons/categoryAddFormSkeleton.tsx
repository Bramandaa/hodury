"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function AddCategoryFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          <Skeleton className="h-6 w-40" />
        </h2>
        <div className="space-x-3">
          <Button
            className="bg-green-300 text-transparent cursor-default"
            disabled
          >
            <Skeleton className="h-5 w-20" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" /> {/* label */}
                <Skeleton className="h-10 w-full rounded-md" /> {/* input */}
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
