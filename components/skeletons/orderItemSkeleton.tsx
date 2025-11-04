import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function OrderItemSkeleton() {
  return (
    <Card className="shadow-sm rounded-xl py-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">
            <Skeleton className="h-4 w-32" />
          </CardTitle>
          <Skeleton className="h-3 w-24 mt-2" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>

        <Skeleton className="h-8 w-full mt-3 rounded-md" />
      </CardContent>
    </Card>
  );
}
