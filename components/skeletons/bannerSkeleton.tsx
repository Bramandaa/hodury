"use client";

export default function BannerSkeleton() {
  return (
    <div className="space-y-2">
      <div className="banner-skeleton"></div>
      <div className="dot-carousel">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-[10px] h-[6px] rounded-full bg-gray-300 opacity-50"
          ></div>
        ))}
      </div>
    </div>
  );
}
