import { prisma } from "../../utils/prisma";
import { requireUser } from "../../utils/requireUser";
import argon2 from "argon2";

export default defineEventHandler(async (event) => {
  const sessionUser = await requireUser(event);
  const { currentPassword, newPassword } = await readBody(event);

  if (!currentPassword || !newPassword || newPassword.length < 8) {
    throw createError({ statusCode: 400, statusMessage: "Nieprawidłowe dane." });
  }

  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) throw createError({ statusCode: 404, statusMessage: "Użytkownik nie istnieje." });

  const valid = await argon2.verify(user.passwordHash, currentPassword);
  if (!valid) {
    throw createError({ statusCode: 400, statusMessage: "Obecne hasło jest nieprawidłowe." });
  }

  const passwordHash = await argon2.hash(newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return { ok: true };
});
