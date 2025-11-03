import { User } from "@prisma/client";

export function toUserDTO(user: User) {
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

export type UserDto = ReturnType<typeof toUserDTO>;

export function toUsersDTOs(user: User[]) {
  return user.map(toUserDTO);
}

export function toUserAddressDTO(user: User) {
  return {
    name: user.name,
    phone: user.phone,
    fullAddress: user.fullAddress,
    provinsi: user.provinsi,
    kabupaten: user.kabupaten,
    kecamatan: user.kecamatan,
  };
}
