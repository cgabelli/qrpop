import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import StudioClient from "./studio-client";

export const metadata = { title: "QRpop Studio" };

export default async function StudioPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const qrSpot = await prisma.qRSpot.findUnique({ where: { id } });

  if (!qrSpot || qrSpot.userId !== session.user.id) {
    redirect("/dashboard/abbonamento");
  }

  // We only allow Studio usage for QR spots that can handle image/pdf/video
  // Actually, we can just save the image and link it to the QR spot by uploading it via the existing endpoints.
  
  return <StudioClient qrSpot={qrSpot} />;
}
