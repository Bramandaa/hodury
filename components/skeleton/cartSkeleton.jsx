export function CartSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border rounded-lg p-4 flex items-center gap-4 bg-gray-50"
          >
            <div className="w-6 h-6 bg-gray-200 rounded-md" />
            <div className="w-16 h-16 bg-gray-200 rounded-md" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded-md" />
          </div>
        ))}
      </div>
      <div className="w-full md:w-[35%] ">
        <div className="rounded-lg shadow-sm fixed bottom-0 left-0 right-0 z-20 p-6 space-y-8 md:sticky md:top-[72px] bg-gray-50">
          <div className="w-40 h-6 bg-gray-200 rounded-md" />
          <div className="w-48 h-6 bg-gray-200 rounded-md" />
          <div className="w-20 h-6 bg-gray-200 rounded-md" />
          <div className="w-full h-8 bg-gray-200 rounded-md" />
        </div>
      </div>
    </div>
  );
}
