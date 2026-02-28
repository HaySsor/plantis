import { prisma } from "../utils/prisma";
import { requireUser } from "../utils/requireUser";

export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const body = await readBody(event);

  const { title, description, city, type, deliveryMode } = body ?? {};

  if (!title || typeof title !== "string" || title.trim().length < 3) {
    throw createError({ statusCode: 400, statusMessage: "Tytuł musi mieć co najmniej 3 znaki" });
  }
  if (!description || typeof description !== "string" || description.trim().length < 10) {
    throw createError({ statusCode: 400, statusMessage: "Opis musi mieć co najmniej 10 znaków" });
  }
  if (!city || typeof city !== "string" || city.trim().length < 2) {
    throw createError({ statusCode: 400, statusMessage: "Podaj miasto odbioru" });
  }

  const validTypes = ["PLANT", "CUTTING", "LEAF", "SEEDS"];
  if (!type || !validTypes.includes(type)) {
    throw createError({ statusCode: 400, statusMessage: "Nieprawidłowy typ ogłoszenia" });
  }

  const validDeliveryModes = ["PICKUP", "SHIPPING", "BOTH"];
  if (!deliveryMode || !validDeliveryModes.includes(deliveryMode)) {
    throw createError({ statusCode: 400, statusMessage: "Nieprawidłowy sposób przekazania" });
  }

  const listing = await prisma.listing.create({
    data: {
      userId: user.id,
      title: title.trim(),
      description: description.trim(),
      city: city.trim(),
      type,
      deliveryMode,
      status: "ACTIVE",
    },
  });

  return { listing };
});
