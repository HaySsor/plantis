import { prisma } from "../utils/prisma";
import { requireUser } from "../utils/requireUser";

export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const body = await readBody(event);

  const { title, description, city, type, deliveryMode, imageUrls,
          watering, light, position, height, difficulty, petFriendly } = body ?? {};

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

  if (deliveryMode !== "PICKUP") {
    throw createError({ statusCode: 400, statusMessage: "Nieprawidłowy sposób przekazania" });
  }

  if (!watering || !["LOW", "MEDIUM", "HIGH"].includes(watering)) {
    throw createError({ statusCode: 400, statusMessage: "Podaj częstotliwość podlewania" });
  }
  if (!light || !["LOW", "MEDIUM", "HIGH", "FULL_SUN"].includes(light)) {
    throw createError({ statusCode: 400, statusMessage: "Podaj wymagania świetlne" });
  }
  if (!position || !["INDOOR", "OUTDOOR", "BOTH"].includes(position)) {
    throw createError({ statusCode: 400, statusMessage: "Podaj stanowisko rośliny" });
  }

  const urls: string[] = Array.isArray(imageUrls)
    ? imageUrls.filter((u: unknown) => typeof u === "string").slice(0, 2)
    : [];

  const listing = await prisma.listing.create({
    data: {
      userId: user.id,
      title: title.trim(),
      description: description.trim(),
      city: city.trim(),
      type,
      deliveryMode,
      status: "PENDING",
      watering,
      light,
      position,
      height: ["SMALL", "MEDIUM", "LARGE"].includes(height) ? height : null,
      difficulty: ["EASY", "MEDIUM", "HARD"].includes(difficulty) ? difficulty : null,
      petFriendly: typeof petFriendly === "boolean" ? petFriendly : null,
      images: urls.length
        ? { create: urls.map((url, order) => ({ url, order })) }
        : undefined,
    },
  });

  return { listing };
});
