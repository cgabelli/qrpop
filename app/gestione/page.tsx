import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import AdminClient from "./admin-client";

export const metadata = { title: "Super Admin | QRpop" };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/accedi");

  const [users, totalSpots, activeSpots] = await Promise.all([
    prisma.user.findMany({
      include: {
        qrSpots: true,
        _count: { select: { qrSpots: true, creativita: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.qRSpot.count(),
    prisma.qRSpot.count({ where: { status: "active" } }),
  ]);

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.isActive).length,
    totalSpots,
    activeSpots,
    companiesCount: users.filter((u) => u.isCompany).length,
    stripeConnected: users.filter((u) => u.stripeCustomerId).length,
  };

  return <AdminClient users={users as any} stats={stats} />;
}
