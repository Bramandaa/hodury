export function ProductCardSkeleton() {
  return (
    <div className="w-full aspect-[4/6] shadow-sm rounded-md p-2 flex flex-col animate-pulse">
      <div className="relative w-full flex-1 bg-gray-200 rounded-md" />
      <div className="mt-2 space-y-1">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
}
