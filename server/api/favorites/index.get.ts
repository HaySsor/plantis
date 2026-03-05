import { prisma } from "../../utils/prisma";
import { requireUser } from "../../utils/requireUser";

export default defineEventHandler(async (event) => {
  const user = await requireUser(event);

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: { listingId: true },
  });

  return { ids: favorites.map((f) => f.listingId) };
});
