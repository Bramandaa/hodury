import { Card, CardContent } from "../ui/card";

export function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <Card
          key={i}
          className="w-full aspect-4/6 shadow-sm p-2 flex flex-col animate-pulse"
        >
          <CardContent className="p-2 flex flex-col h-full">
            <div className="relative w-full aspect-square flex-1 bg-gray-200 rounded-md" />
            <div className="mt-2 space-y-1">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
