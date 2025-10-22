import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import RegisterForm from "./registerForm";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }
  return <RegisterForm />;
}
