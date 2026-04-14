import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      tls: {
        rejectUnauthorized: false,
      },
      ...(process.env.SMTP_USER && {
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }),
    });

    await transporter.verify();
    
    return NextResponse.json({ success: true, message: "SMTP configuration is valid" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack, env: { host: process.env.SMTP_HOST, port: process.env.SMTP_PORT, user: process.env.SMTP_USER } });
  }
}
