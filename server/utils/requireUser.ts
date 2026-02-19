import { prisma } from "./prisma";
import { hashToken } from "./auth";

export type AuthUser = {
  id: string;
  email: string;
};

export async function requireUser(event: any): Promise<AuthUser> {
  const token = getCookie(event, "session");

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const tokenHash = hashToken(token);

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session || session.expiresAt <= new Date()) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  return { id: session.user.id, email: session.user.email };
}
