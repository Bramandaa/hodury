import { unstable_cache } from "next/cache";
import {
  toUserAddressDTO,
  toUserDTO,
  toUsersDTOs,
  UserAddressDTO,
  UserDto,
} from "../dto/user";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export async function getUserById(userId: number) {
  return unstable_cache(
    async (): Promise<UserDto | null> => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) return null;
      return toUserDTO(user);
    },
    [`profile-${userId}`],
    { tags: ["profile"] }
  )();
}

export function getAddress(userId: number) {
  return unstable_cache(
    async (): Promise<UserAddressDTO | null> => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        return null;
      }
      return toUserAddressDTO(user);
    },
    [`profile-${userId}`],
    { tags: ["profile"] }
  )();
}

export function getCouriers({
  skip,
  limit,
  where,
}: {
  skip: number;
  limit: number;
  where: Prisma.UserWhereInput;
}) {
  return unstable_cache(
    async () => {
      const users = await prisma.user.findMany({
        skip,
        where,
        take: limit,
        orderBy: { createdAt: "asc" },
      });

      return toUsersDTOs(users);
    },
    [`courier-${skip}-${limit}-${JSON.stringify(where)}`],
    { tags: ["courier"] }
  )();
}

export async function getCourierById(userId: number) {
  return unstable_cache(
    async (): Promise<UserDto | null> => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) return null;
      return toUserDTO(user);
    },
    [`courier-${userId}`],
    { tags: ["courier"] }
  )();
}
