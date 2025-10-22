import { Banner } from "@prisma/client";

export function toBannerDTO(banner: Banner) {
  return {
    id: banner.id,
    name: banner.name,
    imageUrl: banner.imageUrl,
  };
}

export type BannerDTO = ReturnType<typeof toBannerDTO>;

export function toBannerDTOs(banners: Banner[]) {
  return banners.map(toBannerDTO);
}
