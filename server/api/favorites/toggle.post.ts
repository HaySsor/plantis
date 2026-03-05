import { prisma } from "../../utils/prisma";
import { requireUser } from "../../utils/requireUser";

export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const { listingId } = await readBody(event);

  if (!listingId || typeof listingId !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Brak listingId" });
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_listingId: { userId: user.id, listingId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { action: "removed" };
  }

  await prisma.favorite.create({ data: { userId: user.id, listingId } });
  return { action: "added" };
});
