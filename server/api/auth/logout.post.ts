import { prisma } from "../../utils/prisma";
import { hashToken } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "session");
  if (token) {
    const tokenHash = hashToken(token);
    await prisma.session.deleteMany({ where: { tokenHash } });
  }

  deleteCookie(event, "session", { path: "/" });

  return { ok: true };
});
