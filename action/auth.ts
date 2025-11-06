"use server";

import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validations/authSchema";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { UserRole } from "@prisma/client";
import { UseActionState } from "@/types";

export async function register(
  prevState: UseActionState | null,
  formData: FormData
): Promise<UseActionState> {
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
        role: UserRole.CUSTOMER,
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
  redirect("/login?success=Akun berhasil dibuat");
}

export async function auth(
  prevState: UseActionState | null,
  formData: FormData
): Promise<UseActionState> {
  const rawData = {
    identifier: formData.get("identifier") as string,
    password: formData.get("password") as string,
  };

  const validatedData = loginSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Periksa kembali input form",
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData,
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: rawData.identifier }, { phone: rawData.identifier }],
    },
  });

  if (!user) {
    return {
      success: false,
      message: "Email/nomor telepon atau kata sandi tidak valid",
      inputs: rawData,
    };
  }

  const isValidPassword = await bcrypt.compare(rawData.password, user.password);

  if (!isValidPassword) {
    return {
      success: false,
      message: "Email/nomor telepon atau kata sandi tidak valid",
      inputs: rawData,
    };
  }

  await createSession(user.id, user.role);

  redirect(
    user.role === UserRole.CUSTOMER
      ? "/"
      : user.role === UserRole.ADMIN
      ? "/dashboard"
      : user.role === UserRole.SUPER_ADMIN
      ? "/dashboard"
      : user.role === UserRole.COURIER
      ? "/dashboard/order"
      : "/"
  );
}

export async function logout(): Promise<UseActionState> {
  await deleteSession();
  redirect("/login");
}
