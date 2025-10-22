import { unstable_cache } from "next/cache";
import { toUserDTO, UserDto } from "../dto/user";
import prisma from "../prisma";

export const getUserById = (userId: number) =>
  unstable_cache(
    async (): Promise<UserDto | null> => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) return null;
      return toUserDTO(user);
    },
    [`profile-${userId}`],
    { tags: ["profile"] }
  );

// export async function getCourier({ skip, where, limit }) {
//   const users = await prisma.user.findMany({
//     skip,
//     where,
//     take: limit,
//     orderBy: { createdAt: "asc" },
//   });

//   return toUsersDTOs(users);
// }

// export function getAddress(userId) {
//   return unstable_cache(
//     async () => {
//       const user = await prisma.user.findUnique({
//         where: { id: userId },
//       });
//       if (!user) {
//         return null;
//       }
//       return toUserAddressDTO(user);
//     },
//     [`profile-${userId}`],
//     { tags: ["profile"] }
//   )();
// }
