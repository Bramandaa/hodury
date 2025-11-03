import { BannerDTO, toBannerDTO, toBannerDTOs } from "@/lib/dto/banner";
import prisma from "../prisma";
import { unstable_cache } from "next/cache";

const getCachedBanners = unstable_cache(
  async (): Promise<BannerDTO[]> => {
    const banners = await prisma.banner.findMany({
      orderBy: { id: "asc" },
    });
    return toBannerDTOs(banners);
  },
  ["banners"],
  {
    tags: ["banner"],
    revalidate: 60,
  }
);

export function getBanners() {
  return getCachedBanners();
}

export const getBanner = (id: number) =>
  unstable_cache(async (): Promise<BannerDTO | null> => {
    const banner = await prisma.banner.findUnique({
      where: { id: id },
    });
    if (!banner) return null;
    return toBannerDTO(banner);
  });
