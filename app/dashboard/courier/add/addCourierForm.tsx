"use client";

import { useActionState, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/inputField";
import { registerCourier } from "@/action/courier";

export default function AddCourierForm() {
  const [state, action, isPending] = useActionState(registerCourier, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form action={action}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tambah Akun Kurir</h2>
          <div className="space-x-3">
            <>
              <Button
                className={`cursor-pointer ${
                  isPending ? "bg-green-300" : "bg-green-500 hover:bg-green-400"
                } flex items-center gap-2`}
                type="submit"
                disabled={isPending}
                aria-busy={isPending}
              >
                {isPending ? (
                  <>
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-gray-300 animate-spin dark:text-gray-600 fill-white"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="currentColor"
                        d="M2.727 1.364c-.753 0-1.363.61-1.363 1.363v14.546c0 .753.61 1.363 1.363 1.363h14.546c.753 0 1.363-.61 1.363-1.363V2.727c0-.753-.61-1.363-1.363-1.363H2.727ZM17.273 0A2.727 2.727 0 0 1 20 2.727v14.546A2.727 2.727 0 0 1 17.273 20H2.727A2.727 2.727 0 0 1 0 17.273V2.727A2.727 2.727 0 0 1 2.727 0h14.546Zm-3.318 2.435a.682.682 0 0 0-.682.682V5a.682.682 0 0 0 1.364 0V3.117a.682.682 0 0 0-.682-.682ZM2.744.94l1.363.006l-.021 4.446c-.03.406.1.734.415 1.037c.313.301.744.438 1.384.4l8.625.004c.482-.055.821-.213 1.05-.469c.228-.257.346-.603.345-1.073V.942h1.364v4.347c.001.789-.227 1.46-.692 1.982c-.465.522-1.114.825-1.99.92h-8.66c-.959.059-1.765-.197-2.371-.78c-.604-.58-.89-1.304-.832-2.072l.02-4.4Z"
                      />
                    </svg>
                    Simpan
                  </>
                )}
              </Button>
            </>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-4">
                <InputField
                  id="name"
                  label="Nama"
                  placeholder="Masukkan nama lengkap"
                  defaultValue={state?.inputs?.name}
                  required
                  autoComplete="name"
                  error={state?.errors?.name}
                />

                <InputField
                  id="email"
                  label="Email (Opsional)"
                  type="email"
                  placeholder="Masukkan email"
                  defaultValue={state?.inputs?.email}
                  autoComplete="email"
                  error={state?.errors?.email}
                />

                <InputField
                  id="phone"
                  label="Nomor HP"
                  placeholder="Masukkan nomor HP"
                  defaultValue={state?.inputs?.phone}
                  required
                  autoComplete="tel"
                  error={state?.errors?.phone}
                />

                <InputField
                  id="password"
                  label="Password"
                  placeholder="Buat password"
                  defaultValue={state?.inputs?.password}
                  required
                  autoComplete="new-password"
                  error={state?.errors?.password}
                  toggle={{
                    show: showPassword,
                    setShow: () => setShowPassword(!showPassword),
                  }}
                />

                <InputField
                  id="confirm_password"
                  label="Konfirmasi Password"
                  placeholder="Ulangi password"
                  defaultValue={state?.inputs?.confirm_password}
                  required
                  autoComplete="new-password"
                  error={state?.errors?.confirm_password}
                  toggle={{
                    show: showConfirm,
                    setShow: () => setShowConfirm(!showConfirm),
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </form>
  );
}
