import { prisma } from "../../../../utils/prisma";
import { requireAdmin } from "../../../../utils/requireAdmin";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing id" });

  const listing = await prisma.listing.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      city: true,
      type: true,
      deliveryMode: true,
      status: true,
      watering: true,
      light: true,
      height: true,
      position: true,
      difficulty: true,
      petFriendly: true,
      createdAt: true,
      images: { select: { url: true, order: true }, orderBy: { order: "asc" } },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!listing) throw createError({ statusCode: 404, statusMessage: "Not found" });

  return { listing };
});
