import { prisma } from "../utils/prisma";

export default defineEventHandler(async () => {
  await prisma.$queryRawUnsafe("SELECT 1");
  return { status: "ok" };
});
