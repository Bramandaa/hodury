"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState, useState } from "react";
import { auth } from "../../action/auth";
import { InputField } from "@/components/inputField";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function LoginForm() {
  const [state, action, isPending] = useActionState(auth, undefined);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (formData) => {
    state.message = "";
    action(formData);
  };

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
          <form
            className="space-y-4"
            action={(formData) => handleLogin(formData)}
          >
            {/* Identifier */}
            <InputField
              id="identifier"
              name="identifier"
              label="Email / Nomor HP"
              type="text"
              autocapitalize="on"
              spellcheck="false"
              placeholder="Masukkan email atau No. HP"
              defaultValue={state?.inputs?.identifier}
              required
              error={state?.errors?.identifier?.[0]}
            />

            {/* Password */}
            <InputField
              id="password"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              defaultValue={state?.inputs?.password}
              required
              minLength={7}
              autoComplete="current-password"
              error={state?.errors?.password?.[0]}
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
              {isPending ? "Memproses..." : "Login"}
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
