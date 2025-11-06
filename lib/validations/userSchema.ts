import z from "zod";

export const editUserProfileSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().or(z.literal("")).optional(),
  phone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .regex(/^\d+$/, "Nomor telepon hanya boleh angka"),
});

export const editUserAddressSchema = z.object({
  fullAddress: z
    .string()
    .min(5, "Alamat lengkap harus diisi minimal 5 karakter")
    .max(255, "Alamat terlalu panjang"),
  provinsi: z.string().min(2, "Provinsi harus dipilih"),
  kabupaten: z.string().min(2, "Kabupaten harus dipilih"),
  kecamatan: z.string().min(2, "Kecamatan harus dipilih"),
});
