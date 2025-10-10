import { z } from "zod";
import prisma from "@/lib/prisma";

const percentageSchema = z.object({
  discountType: z.literal("PERCENTAGE"),
  discount: z.coerce.number().int().min(0).max(100, "Diskon maksimal 100"),
});

const fixedSchema = z.object({
  discountType: z.literal("FIXED"),
  discount: z.coerce.number().int().min(0),
});

const noneSchema = z.object({
  discountType: z.nullable(z.literal(null)).default(null),
  discount: z.coerce.number().int().min(0).optional().nullable(),
});

const discountSchema = z.union([
  z.discriminatedUnion("discountType", [percentageSchema, fixedSchema]),
  noneSchema,
]);

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const addProductSchema = z
  .object({
    name: z.string().min(1, "Wajib"),
    slug: z
      .string()
      .min(1, "Wajib")
      .refine(
        async (slug) => {
          const existing = await prisma.product.findUnique({
            where: { slug },
          });
          return !existing;
        },
        { message: "Slug sudah digunakan" }
      ),
    description: z.string().optional(),
    price: z.coerce
      .number()
      .int()
      .min(1, "Harus lebih dari 0")
      .max(2147483647, "Harga terlalu besar, maksimal 2,147,483,647"),
    categoryId: z
      .string()
      .refine((val) => val !== "", { message: "Wajib" })
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Kategori tidak valid",
      }),

    status: z.enum(["ACTIVE", "INACTIVE"]).default("INACTIVE"),
    isFeatured: z.coerce.boolean().default(false),
    image: z
      .any()
      .refine((file) => file instanceof File && file.size > 0, {
        message: "Wajib",
      })
      .refine((file) => file instanceof File && file.size <= MAX_FILE_SIZE, {
        message: "Ukuran gambar maksimal 2MB",
      })
      .refine(
        (file) =>
          file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type),
        { message: "Format gambar harus JPG, PNG, atau WEBP" }
      ),
  })
  .and(discountSchema);

export const editProductSchema = z
  .object({
    name: z.string().min(1, "Wajib"),
    slug: z.string().min(1, "Wajib"),
    description: z.string().optional(),
    price: z.coerce
      .number()
      .int()
      .min(1, "Harus lebih dari 0")
      .max(2147483647, "Harga terlalu besar, maksimal 2,147,483,647"),
    categoryId: z
      .string()
      .refine((val) => val !== "", { message: "Wajib" })
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Kategori tidak valid",
      }),

    status: z.enum(["ACTIVE", "INACTIVE"]).default("INACTIVE"),
    isFeatured: z.coerce.boolean().default(false),
    image: z
      .any()
      .transform((file) =>
        file instanceof File && file.size > 0 ? file : undefined
      )
      .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
        message: "Ukuran gambar maksimal 2MB",
      })
      .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Format gambar harus JPG, PNG, atau WEBP",
      })
      .optional(),

    imageUrl: z.string().url("URL tidak valid").optional().nullable(),
  })
  .and(discountSchema);
