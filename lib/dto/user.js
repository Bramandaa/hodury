export function toUserDTO(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    fullAddress: user.fullAddress,
    provinsi: user.provinsi,
    kabupaten: user.kabupaten,
    kecamatan: user.kecamatan,
  };
}

export function toUsersDTOs(products) {
  return products.map(toUserDTO);
}

export function toUserAddressDTO(user) {
  return {
    name: user.name,
    phone: user.phone,
    fullAddress: user.fullAddress,
    provinsi: user.provinsi,
    kabupaten: user.kabupaten,
    kecamatan: user.kecamatan,
  };
}
