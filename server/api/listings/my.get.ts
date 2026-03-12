import { prisma } from "../../utils/prisma";
import { requireUser } from "../../utils/requireUser";

export default defineEventHandler(async (event) => {
  const user = await requireUser(event);

  const listings = await prisma.listing.findMany({
    where: { userId: user.id, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      type: true,
      createdAt: true,
      images: { select: { url: true }, orderBy: { order: "asc" }, take: 1 },
    },
  });

  return { listings };
});
