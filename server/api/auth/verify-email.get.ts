import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event);

  if (!token || typeof token !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Brakujący token." });
  }

  const record = await prisma.emailVerificationToken.findUnique({ where: { token } });

  if (!record || record.expiresAt < new Date()) {
    throw createError({ statusCode: 400, statusMessage: "Link wygasł lub jest nieprawidłowy." });
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerified: true },
  });

  await prisma.emailVerificationToken.delete({ where: { token } });

  return { ok: true };
});
