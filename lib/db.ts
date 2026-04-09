import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = (process.env.DATABASE_URL && process.env.DATABASE_URL !== "undefined") 
          ? process.env.DATABASE_URL 
          : "file:./dev.db";

  const libsql = createClient({ url });
  
  // @ts-expect-error - Prisma and libSQL TS definitions mismatch on Client vs Config type
  const adapter = new PrismaLibSql(libsql);
  
  return new PrismaClient({
    adapter,
    // @ts-expect-error - Prisma types exclude datasources when schema url is removed
    datasources: {
      db: { url }
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
