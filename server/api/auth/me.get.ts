import { prisma } from "../../utils/prisma";
import { hashToken } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "session");
  if (!token) return { user: null };

  const tokenHash = hashToken(token);

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session) return { user: null };
  if (session.expiresAt <= new Date()) return { user: null };

  return { user: { id: session.user.id, email: session.user.email } };
});
