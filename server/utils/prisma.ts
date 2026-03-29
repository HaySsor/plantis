import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const { PrismaClient } = pkg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const adapter = new PrismaPg({ connectionString, max: 1 });

export const prisma = new PrismaClient({ adapter });
