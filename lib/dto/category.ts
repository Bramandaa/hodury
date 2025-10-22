export function toCategoryDTO(category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
  };
}

export function toCategoriesDTOs(category) {
  return category.map(toCategoryDTO);
}
