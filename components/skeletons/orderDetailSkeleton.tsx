import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Order Info */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              <Skeleton className="h-4 w-36" />
            </CardTitle>
            <Skeleton className="h-3 w-24 mt-2" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="px-1">
            <Separator className="my-2" />
          </div>

          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between text-sm">
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
            <div className="flex justify-between text-sm">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex justify-between text-sm">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          <div className="px-1">
            <Separator className="my-2" />
          </div>

          <div className="flex justify-between text-sm font-semibold">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-24" />
          </div>
        </CardContent>
      </Card>

      {/* Progress Status */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-4 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between relative">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-3 w-12 mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Info */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-4 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-3 w-56" />
          <Skeleton className="h-3 w-40" />
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
