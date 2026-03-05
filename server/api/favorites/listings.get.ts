import { prisma } from "../../utils/prisma";
import { requireUser } from "../../utils/requireUser";

export default defineEventHandler(async (event) => {
  const user = await requireUser(event);

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      listing: {
        select: {
          id: true,
          title: true,
          city: true,
          type: true,
          deliveryMode: true,
          createdAt: true,
          images: {
            select: { url: true, order: true },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  return { items: favorites.map((f) => f.listing) };
});
