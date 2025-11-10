import { BannerDTO, toBannerDTO, toBannerDTOs } from "@/lib/dto/banner";
import prisma from "../prisma";
import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";

export const getBanners = unstable_cache(
  async (): Promise<BannerDTO[]> => {
    const banners = await prisma.banner.findMany({
      orderBy: { id: "asc" },
    });
    return toBannerDTOs(banners);
  },
  ["banners"],
  {
    tags: ["banner"],
  }
);

export function getBannersByAdminWithCondition({
  skip,
  limit,
  where,
}: {
  skip: number;
  limit: number;
  where: Prisma.BannerWhereInput;
}) {
  return unstable_cache(
    async (): Promise<BannerDTO[]> => {
      const banners = await prisma.banner.findMany({
        skip,
        take: limit,
        orderBy: { id: "asc" },
        where,
      });
      return toBannerDTOs(banners);
    },
    [`banner-${skip}-${limit}-${JSON.stringify(where)}`],
    {
      tags: ["banner"],
    }
  )();
}

export async function getBanner(id: number) {
  return unstable_cache(
    async (): Promise<BannerDTO | null> => {
      const banner = await prisma.banner.findUnique({
        where: { id },
      });
      if (!banner) return null;
      return toBannerDTO(banner);
    },
    [`banner-${id}`],
    {
      tags: ["banner"],
    }
  )();
}
