import { prisma } from "../../utils/prisma";
import { requireUser } from "../../utils/requireUser";

export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const id = getRouterParam(event, "id");

  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing id" });

  const existing = await prisma.listing.findFirst({
    where: { id, userId: user.id, status: { not: "DELETED" } },
  });

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: "Nie znaleziono ogłoszenia" });
  }

  await prisma.listing.update({
    where: { id },
    data: { status: "DELETED" },
  });

  return { ok: true };
});
