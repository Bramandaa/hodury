"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { verifySession } from "@/lib/session";
import { UseActionState } from "@/types";
import { categorySchema } from "@/lib/validations/categorySchema";

export async function addCategory(
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
      slug: formData.get("slug") as string,
    };

    const validated = categorySchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Periksa kembali input form",
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }

    const data = validated.data;

    const existing = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return {
        success: false,
        message: "Slug sudah digunakan",
        errors: { slug: ["Slug sudah digunakan"] },
        inputs: rawData,
      };
    }

    await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });
  } catch (error) {
    console.error("Kategori gagal disimpan :", error);
    return {
      success: false,
      message: "Terjadi kesalahan, coba lagi",
    };
  }
  updateTag("category");
  redirect("/dashboard/category?success=Kategori berhasil ditambahkan");
}

export async function editCategory(
  prevState: UseActionState | null,
  formData: FormData
): Promise<UseActionState> {
  const session = await verifySession();

  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }
  try {
    const oldSlug = formData.get("oldSlug");
    if (!oldSlug) {
      return { success: false, message: "Slug lama tidak ditemukan" };
    }

    const category = await prisma.category.findUnique({
      where: { slug: String(oldSlug) },
    });

    if (!category) {
      return { success: false, message: "Kategori tidak ditemukan" };
    }

    const rawData = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
    };

    const validated = categorySchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        message: "Periksa kembali input form",
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }

    const data = validated.data;

    if (data.slug && data.slug !== category.slug) {
      const existing = await prisma.category.findUnique({
        where: { slug: data.slug },
      });

      if (existing) {
        return {
          success: false,
          message: "Slug sudah digunakan",
          errors: { slug: ["Slug sudah digunakan"] },
          inputs: rawData,
        };
      }
    }

    await prisma.category.update({
      where: { id: category.id },
      data: {
        name: data.name,
        slug: data.slug,
      },
    });
  } catch (error) {
    console.error("Kategori gagal diperbarui :", error);
    return { success: false, message: "Terjadi kesalahan, coba lagi" };
  }
  updateTag("category");
  const query = formData.get("query");
  redirect(`/dashboard/category?${query}&success=Kategori berhasil diperbarui`);
}

export async function deleteCategory(id: number, query: string) {
  const session = await verifySession();

  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }
  try {
    await prisma.category.delete({
      where: { id: Number(id) },
    });
  } catch (error) {
    console.error("Gagal hapus kategori:", error);
    return { success: false, message: "Kategori gagal dihapus" };
  }
  updateTag("category");
  redirect(`/dashboard/category?${query}&success=Kategori berhasil dihapus`);
}
