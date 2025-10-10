export function toBannerDTO(banner) {
  return {
    id: banner.id,
    name: banner.name,
    imageUrl: banner.imageUrl,
  };
}

export function toBannerDTOs(banners) {
  return banners.map(toBannerDTO);
}
