import { prisma } from "../../../utils/prisma";
import { requireAdmin } from "../../../utils/requireAdmin";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const listings = await prisma.listing.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      city: true,
      type: true,
      createdAt: true,
      images: { select: { url: true }, orderBy: { order: "asc" }, take: 1 },
      user: { select: { name: true, email: true } },
    },
  });

  return { listings };
});
