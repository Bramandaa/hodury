"use server";

import ImageKit from "imagekit";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { UseActionState } from "@/types";
import {
  addProductSchema,
  editProductSchema,
} from "@/lib/validations/productSchema";
import { ProductStatus } from "@prisma/client";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function addProduct(
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
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      discountType: formData.get("discountType") as string,
      discount: formData.get("discount") as string,
      categoryId: formData.get("categoryId") as string,
      status: formData.get("status") as string,
      isFeatured: formData.get("isFeatured") as string,
      image: formData.get("image") as string,
    };

    const validated = await addProductSchema.safeParseAsync(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Periksa kembali input form",
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }

    const data = validated.data;

    let imageUrl = "";
    let fileId = "";
    if (data.image && data.image instanceof File) {
      const arrayBuffer = await data.image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: data.image.name,
        folder: "/products",
      });

      imageUrl = uploadResponse.url;
      fileId = uploadResponse.fileId;
    }

    await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: Number(data.price),
        discountType: data.discountType,
        discount: Number(data.discount),
        categoryId: Number(data.categoryId),
        status: data.status,
        isFeatured: data.isFeatured,
        imageUrl,
        fileId,
      },
    });
  } catch (error) {
    console.error("Produk gagal disimpan :", error);
    return {
      success: false,
      message: "Terjadi kesalahan, coba lagi",
    };
  }
  updateTag("product");
  redirect("/dashboard/product?success=Produk berhasil ditambahkan");
}

export async function editProduct(
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
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      discountType: formData.get("discountType") as string,
      discount: formData.get("discount") as string,
      categoryId: formData.get("categoryId") as string,
      status: formData.get("status") as string,
      isFeatured: formData.get("isFeatured") as string,
      image: formData.get("image") as string,
      imageUrl: formData.get("imageUrl") as string,
    };

    const oldSlug = formData.get("oldSlug");
    if (!oldSlug) {
      return { success: false, message: "Slug lama tidak ditemukan" };
    }

    const product = await prisma.product.findUnique({
      where: { slug: String(oldSlug) },
    });

    if (!product) {
      return { success: false, message: "Produk tidak ditemukan" };
    }

    const validated = await editProductSchema.safeParseAsync(rawData);
    if (!validated.success) {
      return {
        success: false,
        message: "Periksa kembali input form",
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }

    const data = validated.data;
    let imageUrl = product.imageUrl;
    let fileId = product.fileId;

    if (data.slug && data.slug !== product.slug) {
      const existing = await prisma.product.findUnique({
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

    if (data.image && data.image instanceof File) {
      if (product.imageUrl) {
        try {
          await imagekit.deleteFile(product.fileId);
        } catch {
          console.warn("Gagal hapus gambar lama:");
        }
      }

      const arrayBuffer = await data.image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: data.image.name,
        folder: "/products",
      });

      imageUrl = uploadResponse.url;
      fileId = uploadResponse.fileId;
    } else if (data.imageUrl) {
      imageUrl = data.imageUrl;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: Number(data.price),
        discountType: data.discountType,
        discount: Number(data.discount),
        categoryId: Number(data.categoryId),
        status: data.status,
        isFeatured: data.isFeatured,
        imageUrl,
        fileId,
      },
    });
  } catch (error) {
    console.error("Produk gagal diperbarui :", error);
    return {
      success: false,
      message: "Terjadi kesalahan, coba lagi",
    };
  }
  updateTag("product");
  const query = formData.get("query");
  redirect(`/dashboard/product?${query}&success=Produk berhasil diperbarui`);
}

export async function updateProductStatus(
  id: number,
  status: ProductStatus,
  query: string
) {
  const session = await verifySession();

  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }

  try {
    await prisma.product.update({
      where: { id: Number(id) },
      data: { status },
    });
  } catch (error) {
    console.error("Gagal update status produk:", error);
    throw new Error("Gagal mengubah status produk");
  }
  updateTag("product");
  redirect(`/dashboard/product?${query}&success=Status Produk berhasil diubah`);
}

export async function deleteProduct(id: number, query: string) {
  const session = await verifySession();

  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return { success: false, message: "Produk tidak ditemukan" };
    }

    if (product.fileId) {
      await imagekit.deleteFile(product.fileId);
    }

    await prisma.product.delete({
      where: { id: Number(id) },
    });
  } catch (error) {
    console.error("Gagal hapus produk:", error);
    return { success: false, message: "Produk gagal dihapus" };
  }

  updateTag("product");
  redirect(`/dashboard/product?${query}&success=Produk berhasil dihapus`);
}
