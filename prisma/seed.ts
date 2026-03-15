import "dotenv/config";
import argon2 from "argon2";
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const { PrismaClient } = pkg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is missing");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@plantis.pl";
  const password = process.env.ADMIN_PASSWORD ?? "zmien_mnie_123!";
  const name = "Administrator";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`✓ Admin already exists: ${email}`);
    return;
  }

  const passwordHash = await argon2.hash(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, name, role: "ADMIN" },
  });

  console.log(`✓ Admin created: ${user.email} (id: ${user.id})`);
  console.log(`  Password: ${password}`);
  console.log(`  ⚠  Zmień hasło po pierwszym logowaniu!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
