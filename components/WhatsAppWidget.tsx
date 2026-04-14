import { auth } from "@/lib/auth";
import WhatsAppButton from "./WhatsAppButton";

export default async function WhatsAppWidget() {
  const session = await auth();
  const user = session?.user as { email?: string; name?: string; businessName?: string } | undefined;
  
  let text = "Ciao! Ho bisogno di maggiori informazioni su QRpop.";
  if (user) {
    const name = user.businessName || user.name || "un utente";
    const email = user.email ? ` (${user.email})` : "";
    text = `Ciao! Sono ${name}${email} e ho bisogno di assistenza con QRpop.`;
  }

  return <WhatsAppButton text={text} />;
}
