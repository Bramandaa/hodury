import { toUserAddressDTO, toUserDTO, toUsersDTOs } from "../dto/user";
import prisma from "../prisma";

export async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return null;
  }

  return toUserDTO(user);
}

export async function getCourier({ skip, where, limit }) {
  const users = await prisma.user.findMany({
    skip,
    where,
    take: limit,
    orderBy: { createdAt: "asc" },
  });

  return toUsersDTOs(users);
}

export async function getAddress(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return toUserAddressDTO(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Gagal mengambil data user");
  }
}
