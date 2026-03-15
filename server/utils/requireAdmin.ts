import { requireUser, type AuthUser } from "./requireUser";

export async function requireAdmin(event: any): Promise<AuthUser> {
  const user = await requireUser(event);

  if (user.role !== "ADMIN") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  return user;
}
