import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET() {
  try {
    const { stdout } = await execAsync("pm2 logs qrpop-web --lines 100 --nostream");
    return new NextResponse(stdout, { headers: { "Content-Type": "text/plain" } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
