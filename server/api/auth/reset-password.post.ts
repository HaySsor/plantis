import { prisma } from "../../utils/prisma";
import argon2 from "argon2";

export default defineEventHandler(async (event) => {
  const { token, password } = await readBody(event);

  if (!token || !password || password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: "Nieprawidłowe dane." });
  }

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!record || record.expiresAt < new Date()) {
    throw createError({ statusCode: 400, statusMessage: "Link wygasł lub jest nieprawidłowy." });
  }

  const passwordHash = await argon2.hash(password);

  await prisma.user.update({
    where: { id: record.userId },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return { ok: true };
});
