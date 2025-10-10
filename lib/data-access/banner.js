import { toBannerDTO, toBannerDTOs } from "@/lib/dto/banner";
import prisma from "../prisma";

export async function getBanners() {
  const banners = await prisma.banner.findMany({
    orderBy: { id: "asc" },
  });

  return toBannerDTOs(banners);
}

export async function getBanner(id) {
  const banner = await prisma.banner.findUnique({
    where: { id: id },
  });

  return toBannerDTO(banner);
}
