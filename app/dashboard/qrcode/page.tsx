import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import QRCodeClient from "./qrcode-client";

export const metadata = { title: "Il mio QR code" };

export default async function QRCodePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = session.user as { slug?: string; businessName?: string };
  const slug = user.slug ?? "";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://qrpop.it";
  const url = `${baseUrl}/r/${slug}`;

  return (
    <div style={{ padding: "40px 48px", maxWidth: 900 }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Il tuo QR code</h1>
        <p style={{ color: "hsl(240 5% 55%)", fontSize: 16 }}>
          Questo QR è statico e non cambierà mai. Stampalo e posizionalo sui tavoli del tuo locale.
        </p>
      </div>

      <QRCodeClient url={url} slug={slug} businessName={user.businessName ?? slug} />
    </div>
  );
}
