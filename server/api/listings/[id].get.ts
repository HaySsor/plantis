import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing id" });
  }

  const listing = await prisma.listing.findFirst({
    where: { id, status: "ACTIVE" },
    select: {
      id: true,
      title: true,
      description: true,
      city: true,
      type: true,
      deliveryMode: true,
      watering: true,
      light: true,
      height: true,
      position: true,
      difficulty: true,
      petFriendly: true,
      createdAt: true,
      images: { select: { url: true, order: true }, orderBy: { order: "asc" } },
      user: { select: { name: true } },
    },
  });

  if (!listing) {
    throw createError({ statusCode: 404, statusMessage: "Not found" });
  }

  return { listing };
});
