import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AbbonamentoClient from "./abbonamento-client";

export const metadata = { title: "QR Spot & Gestione" };

export default async function AbbonamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/accedi");

  const params = await searchParams;
  const user = await prisma.user.findUnique({ 
    where: { id: session.user.id },
    include: {
      qrSpots: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) redirect("/accedi");

  return (
    <AbbonamentoClient
      qrSpots={user.qrSpots}
      successParam={!!params.success}
      canceledParam={!!params.canceled}
    />
  );
}
