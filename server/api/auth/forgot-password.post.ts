import { prisma } from "../../utils/prisma";
import { sendPasswordResetEmail } from "../../utils/email";
import { randomBytes } from "node:crypto";

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);

  if (!email || typeof email !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Podaj adres email." });
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

  // Zawsze zwracamy success — nie ujawniamy czy email istnieje
  if (!user) return { ok: true };

  // Rate limit: max 3 emaile dziennie na konto
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todayCount = await prisma.passwordResetToken.count({
    where: {
      userId: user.id,
      createdAt: { gt: startOfDay },
    },
  });

  if (todayCount >= 3) {
    throw createError({ statusCode: 429, statusMessage: "Przekroczono dzienny limit prób. Spróbuj jutro." });
  }

  // Cooldown: min. 15 minut między próbami
  const recentToken = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      createdAt: { gt: new Date(Date.now() - 15 * 60 * 1000) },
    },
  });

  if (recentToken) {
    throw createError({ statusCode: 429, statusMessage: "Poczekaj 15 minut przed kolejną próbą." });
  }

  // Usuń stare tokeny użytkownika
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  await sendPasswordResetEmail(user.email, token);

  return { ok: true };
});
