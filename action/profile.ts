"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import {
  editUserAddressSchema,
  editUserProfileSchema,
} from "@/lib/validations/userSchema";
import { UseActionState } from "@/types";
import { updateTag } from "next/cache";

export async function editUserProfile(
  prevState: UseActionState | null,
  formData: FormData
): Promise<UseActionState> {
  const session = await verifySession();
  if (!session) {
    throw new Error("Harus Login");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return { success: false, message: "User tidak ditemukan" };
    }

    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    };

    const validated = editUserProfileSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        message: "Periksa kembali input form",
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }

    const data = validated.data;

    if (data.phone && data.phone !== user.phone) {
      const existing = await prisma.user.findUnique({
        where: { phone: data.phone },
      });

      if (existing) {
        return {
          success: false,
          message: "Nomor HP sudah digunakan",
          errors: { phone: ["Nomor HP sudah digunakan"] },
          inputs: rawData,
        };
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    });
  } catch (error) {
    console.error("Profile gagal diperbarui :", error);
    return { success: false, message: "Terjadi kesalahan, coba lagi" };
  }
  updateTag("profile");
  return {
    success: true,
    message: "Berhasil mengubah data user",
    timestamp: Date.now(),
  };
}

export async function editUserAdress(
  prevState: UseActionState | null,
  formData: FormData
): Promise<UseActionState> {
  const session = await verifySession();
  if (!session) {
    throw new Error("Harus Login");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return { success: false, message: "User tidak ditemukan" };
    }

    const rawData = {
      fullAddress: formData.get("fullAddress") as string,
      provinsi: formData.get("provinsi") as string,
      kabupaten: formData.get("kabupaten") as string,
      kecamatan: formData.get("kecamatan") as string,
    };

    const validated = editUserAddressSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        message: "Periksa kembali input form",
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }

    const data = validated.data;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        fullAddress: data.fullAddress,
        provinsi: data.provinsi,
        kabupaten: data.kabupaten,
        kecamatan: data.kecamatan,
      },
    });
  } catch (error) {
    console.error("Alamat gagal diperbarui :", error);
    return { success: false, message: "Terjadi kesalahan, coba lagi" };
  }
  updateTag("profile");
  return {
    success: true,
    message: "Berhasil mengubah alamat",
    timestamp: Date.now(),
  };
}

export async function editAdressCheckout(
  prevState: UseActionState | null,
  formData: FormData
): Promise<UseActionState> {
  const session = await verifySession();
  if (!session) {
    throw new Error("Harus Login");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return { success: false, message: "User tidak ditemukan" };
    }

    const rawData = {
      fullAddress: formData.get("fullAddress") as string,
      provinsi: formData.get("provinsi") as string,
      kabupaten: formData.get("kabupaten") as string,
      kecamatan: formData.get("kecamatan") as string,
    };

    const validated = editUserAddressSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        message: "Periksa kembali input form",
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }

    const data = validated.data;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        fullAddress: data.fullAddress,
        provinsi: data.provinsi,
        kabupaten: data.kabupaten,
        kecamatan: data.kecamatan,
      },
    });
  } catch (error) {
    console.error("Alamat gagal diperbarui :", error);
    return { success: false, message: "Terjadi kesalahan, coba lagi" };
  }
  updateTag("profile");
  return {
    success: true,
    message: "Berhasil mengubah alamat",
    timestamp: Date.now(),
  };
}
