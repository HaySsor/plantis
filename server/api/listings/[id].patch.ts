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

  const body = await readBody(event);
  const { title, description, city, type, deliveryMode, watering, light, position, height, difficulty } = body ?? {};

  if (!title || typeof title !== "string" || title.trim().length < 3) {
    throw createError({ statusCode: 400, statusMessage: "Tytuł musi mieć co najmniej 3 znaki" });
  }
  if (!description || typeof description !== "string" || description.trim().length < 10) {
    throw createError({ statusCode: 400, statusMessage: "Opis musi mieć co najmniej 10 znaków" });
  }
  if (!city || typeof city !== "string" || city.trim().length < 2) {
    throw createError({ statusCode: 400, statusMessage: "Podaj miasto" });
  }

  const validTypes = ["PLANT", "CUTTING", "LEAF", "SEEDS"];
  if (!type || !validTypes.includes(type)) {
    throw createError({ statusCode: 400, statusMessage: "Nieprawidłowy typ ogłoszenia" });
  }

  const validDeliveryModes = ["PICKUP", "SHIPPING", "BOTH"];
  if (!deliveryMode || !validDeliveryModes.includes(deliveryMode)) {
    throw createError({ statusCode: 400, statusMessage: "Nieprawidłowy sposób przekazania" });
  }

  const updated = await prisma.listing.update({
    where: { id },
    data: {
      title: title.trim(),
      description: description.trim(),
      city: city.trim(),
      type,
      deliveryMode,
      watering: ["LOW", "MEDIUM", "HIGH"].includes(watering) ? watering : undefined,
      light: ["LOW", "MEDIUM", "HIGH", "FULL_SUN"].includes(light) ? light : undefined,
      position: ["INDOOR", "OUTDOOR", "BOTH"].includes(position) ? position : undefined,
      height: ["SMALL", "MEDIUM", "LARGE"].includes(height) ? height : null,
      difficulty: ["EASY", "MEDIUM", "HARD"].includes(difficulty) ? difficulty : null,
      status: "PENDING",
    },
  });

  return { listing: updated };
});
