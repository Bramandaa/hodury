"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { verifySession } from "@/lib/session";
import { registerSchema } from "@/lib/validations/authSchema";
import { editUserProfileSchema } from "@/lib/validations/userSchema";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { UseActionState } from "@/types";

export async function registerCourier(
  prevState: UseActionState | null,
  formData: FormData
): Promise<UseActionState> {
  const session = await verifySession();

  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      password: formData.get("password") as string,
      confirm_password: formData.get("confirm_password") as string,
    };

    const validatedData = registerSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Periksa kembali input form",
        errors: validatedData.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }

    // Cek email duplikat (jika ada)
    if (rawData.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: rawData.email },
      });
      if (existingUser) {
        return {
          success: false,
          message: "Email sudah terdaftar",
          inputs: rawData,
        };
      }
    }

    // Cek phone duplikat
    const existingPhone = await prisma.user.findUnique({
      where: { phone: rawData.phone },
    });
    if (existingPhone) {
      return {
        success: false,
        message: "Nomor telepon sudah terdaftar",
        inputs: rawData,
      };
    }

    const hashedPassword = await bcrypt.hash(rawData.password, 10);

    await prisma.user.create({
      data: {
        name: rawData.name,
        role: UserRole.COURIER,
        email: rawData.email || null,
        phone: rawData.phone,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan, coba lagi nanti",
    };
  }
  updateTag("courier");
  redirect("/dashboard/courier?success=Akun berhasil dibuat");
}

export async function editCourier(
  prevState: UseActionState | null,
  formData: FormData
): Promise<UseActionState> {
  const session = await verifySession();

  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    };
    const oldPhone = formData.get("oldPhone");
    if (!oldPhone) {
      return { success: false, message: "Nomor HP tidak ditemukan" };
    }

    const user = await prisma.user.findUnique({
      where: { phone: String(oldPhone) },
    });

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

    if (data.phone && data.phone !== user?.phone) {
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
      where: { id: user?.id },
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email ? data.email : null,
      },
    });
  } catch (error) {
    console.error("Akun kurir gagal diperbarui :", error);
    return { success: false, message: "Terjadi kesalahan, coba lagi" };
  }
  updateTag("courier");
  redirect("/dashboard/courier?success=Akun kurir berhasil diperbarui");
}

export async function deleteCourier(id: number, query: string) {
  const session = await verifySession();

  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }
  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });
  } catch (error) {
    console.error("Gagal hapus akun kurir:", error);
    return { success: false, message: "Akun kurir gagal dihapus" };
  }
  updateTag("courier");
  redirect(`/dashboard/courier?${query}&success=Akun kurir berhasil dihapus`);
}
