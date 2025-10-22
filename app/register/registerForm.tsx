"use client";

import { register } from "@/action/auth";
import { InputField } from "@/components/inputField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

export default function RegisterForm() {
  const [state, action, isPending] = useActionState(register, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <section className="flex min-h-dvh items-center justify-center text-primary">
      <Card className="w-full max-w-sm shadow-lg rounded-lg px-4 mx-4">
        <CardHeader className="space-y-2">
          <CardTitle className="text-center text-2xl font-bold">
            Create Account
          </CardTitle>
          {state?.message && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertDescription>
                <p>{state?.message}</p>
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>

        <CardContent>
          <form action={action} className="space-y-4">
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

            <Button
              type="submit"
              className="w-full rounded-md font-medium"
              disabled={isPending}
            >
              {isPending ? "Memproses..." : "Submit"}
            </Button>
          </form>

          {/* Link login */}
          <div className="text-center pt-4 text-sm">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
