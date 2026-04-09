import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=TokenMancante`);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { verificationToken: token }
    });

    if (!user) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=TokenInvalido`);
    }

    if (user.emailVerified) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?verified=already`);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
      }
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?verified=true`);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=ErroreServer`);
  }
}
