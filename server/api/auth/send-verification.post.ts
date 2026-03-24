import { prisma } from "../../utils/prisma";
import { requireUser } from "../../utils/requireUser";
import { sendEmailVerificationEmail } from "../../utils/email";
import { randomBytes } from "node:crypto";

export default defineEventHandler(async (event) => {
  const user = await requireUser(event);

  if (user.emailVerified) {
    throw createError({ statusCode: 400, statusMessage: "Email jest już potwierdzony." });
  }

  // Cooldown: min. 5 minut między próbami
  const recent = await prisma.emailVerificationToken.findFirst({
    where: {
      userId: user.id,
      createdAt: { gt: new Date(Date.now() - 5 * 60 * 1000) },
    },
  });

  if (recent) {
    throw createError({ statusCode: 429, statusMessage: "Poczekaj 5 minut przed kolejną próbą." });
  }

  // Usuń stare tokeny
  await prisma.emailVerificationToken.deleteMany({ where: { userId: user.id } });

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  await prisma.emailVerificationToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  await sendEmailVerificationEmail(user.email, token);

  return { ok: true };
});
