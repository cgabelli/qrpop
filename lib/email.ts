import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

  // If no SMTP server is configured, just print to console (useful for dev)
  if (!process.env.SMTP_HOST) {
    console.log("==========================================");
    console.log(`📡 [DEV] Verification email to ${email}`);
    console.log(`🔗 Link: ${verificationUrl}`);
    console.log("==========================================");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"QRpop" <${process.env.SMTP_FROM || 'noreply@qrpop.it'}>`,
    to: email,
    subject: "Verifica il tuo account QRpop",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #7c3aed;">Benvenuto su QRpop!</h2>
        <p>Grazie per esserti registrato. Per iniziare a utilizzare la piattaforma e sbloccare il tuo abbonamento, verifica il tuo indirizzo email cliccando sul bottone qui sotto:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #7c3aed; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verifica il mio account</a>
        </div>
        <p>Se non hai richiesto questa registrazione, puoi ignorare l'email.</p>
        <p>A presto,<br>Il team di QRpop</p>
      </div>
    `,
  });
}
