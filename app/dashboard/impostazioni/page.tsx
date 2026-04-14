import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import ImpostazioniClient from "./impostazioni-client";

export const metadata = { title: "Impostazioni | QRpop" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/accedi");

  const utente = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!utente) redirect("/accedi");

  return <ImpostazioniClient utente={utente} />;
}
