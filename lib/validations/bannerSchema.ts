import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const addBannerSchema = z.object({
  name: z.string().min(1, "Wajib"),
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
});

export const editBannerSchema = z.object({
  name: z.string().min(1, "Wajib"),
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
});
