import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function BannerFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <div className="space-x-3">
          <Button
            disabled
            className="flex items-center gap-2 bg-gray-300 cursor-not-allowed"
          >
            <Skeleton className="h-5 w-12" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              {/* Input name */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Image preview placeholder */}
              <div className="relative flex items-center justify-center border border-dashed w-full h-46 rounded-md">
                <Skeleton className="w-20 h-20 rounded-md" />
              </div>

              {/* File input */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
