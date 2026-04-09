import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getPlan } from "@/lib/plans";
import AbbonamentoClient from "./abbonamento-client";

export const metadata = { title: "Abbonamento" };

export default async function AbbonamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const currentPlan = getPlan(user.plan);

  return (
    <AbbonamentoClient
      currentPlanId={user.plan}
      currentPlanName={currentPlan.name}
      currentPlanDesc={currentPlan.description}
      stripeSubscriptionId={user.stripeSubscriptionId}
      baseCredits={user.baseCredits}
      purchasedCredits={user.purchasedCredits}
      successParam={!!params.success}
      canceledParam={!!params.canceled}
    />
  );
}
