"use client";

import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import Image from "next/image";
import { use } from "react";
import { BannerDTO } from "@/lib/dto/banner";

export default function Banner({ banners }: { banners: Promise<BannerDTO[]> }) {
  const BannerData = use(banners);

  return (
    <div className="space-y-2">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        centeredSlides={false}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        speed={1000}
        pagination={{
          el: ".slider_banner",
          clickable: true,
        }}
        modules={[Pagination, Autoplay]}
      >
        {BannerData.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="w-full flex justify-center bg-transparent">
              <div className="w-full overflow-hidden relative z-0">
                <div className="relative w-full aspect-5/2 md:aspect-3/1 bg-white">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    sizes="100vh"
                    fill
                    priority
                    className="h-full w-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="dot-carousel slider_banner"></div>
    </div>
  );
}
