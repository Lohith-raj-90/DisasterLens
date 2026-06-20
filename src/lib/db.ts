import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter: adapter as any });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
