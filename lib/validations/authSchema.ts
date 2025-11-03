import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Nama wajib diisi"),
    email: z.string().or(z.literal("")).optional(),
    phone: z
      .string()
      .min(10, "Nomor telepon minimal 10 digit")
      .regex(/^\d+$/, "Nomor telepon hanya boleh angka"),
    password: z.string().min(7, "Password minimal 7 karakter"),
    confirm_password: z
      .string()
      .min(7, "Konfirmasi password minimal 7 karakter"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password tidak sama",
    path: ["confirm_password"],
  });

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or phone number is required")
    .refine(
      (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^\d{10,15}$/.test(val),
      {
        message: "Invalid email or phone number format",
      }
    ),
  password: z.string().min(7, "Password must be at least 7 characters long"),
});
