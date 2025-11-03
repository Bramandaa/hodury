"use client";

import { InputField } from "@/components/inputField";
import Spinner from "@/components/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { auth } from "../../action/auth";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, action, isPending] = useActionState(auth, null);

  return (
    <section className="flex min-h-dvh items-center justify-center text-primary">
      <Card className="w-full max-w-sm shadow-lg rounded-lg px-4 mx-4">
        <CardHeader className="space-y-2 px-6">
          <CardTitle className="text-center text-2xl font-bold">
            Login
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
          <form className="space-y-4" action={action}>
            {/* Identifier */}
            <InputField
              id="identifier"
              label="Email / Nomor HP"
              type="text"
              placeholder="Masukkan email atau No. HP"
              defaultValue={state?.inputs?.identifier}
              required
              error={state?.errors?.identifier}
            />

            {/* Password */}
            <InputField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              defaultValue={state?.inputs?.password}
              required
              autoComplete="current-password"
              error={state?.errors?.password}
              toggle={{
                show: showPassword,
                setShow: () => setShowPassword(!showPassword),
              }}
            />

            <Button
              type="submit"
              className="w-full rounded-md font-medium cursor-pointer"
              disabled={isPending}
            >
              {isPending ? <Spinner /> : "Login"}
            </Button>
          </form>

          <div className="text-center pt-4 text-sm">
            Belum punya akun?{" "}
            <Link href="/register">
              <span className="font-semibold text-primary hover:underline">
                Register
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
