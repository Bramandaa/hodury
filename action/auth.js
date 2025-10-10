"use server";

import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validations/authSchema";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { UserRole } from "@prisma/client";

export async function register(prevState, formData) {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      confirm_password: formData.get("confirm_password"),
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

export async function auth(prevState, formData) {
  const rawData = {
    identifier: formData.get("identifier"),
    password: formData.get("password"),
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

export async function logout() {
  await deleteSession();
  redirect("/login");
}
