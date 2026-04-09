"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    // Passing redirect: false so we process the redirect on the client
    await signIn("credentials", { ...data, redirect: false });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email o password non validi." };
        case "CallbackRouteError":
          return { error: "Errore interno durante il login." };
        default:
          return { error: "Errore durante l'accesso." };
      }
    }
    // AuthError Next.js Redirect
    throw error;
  }
}
