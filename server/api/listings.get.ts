import { prisma } from "../utils/prisma";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = Math.max(1, Number(query.page ?? 1));
  const pageSize = Math.min(50, Math.max(1, Number(query.pageSize ?? 12)));

  const city       = typeof query.city       === "string" ? query.city.trim()  : undefined;
  const type       = typeof query.type       === "string" ? query.type         : undefined;
  const q          = typeof query.q          === "string" ? query.q.trim()     : undefined;
  const watering   = typeof query.watering   === "string" ? query.watering     : undefined;
  const light      = typeof query.light      === "string" ? query.light        : undefined;
  const position   = typeof query.position   === "string" ? query.position     : undefined;
  const height     = typeof query.height     === "string" ? query.height       : undefined;
  const difficulty = typeof query.difficulty === "string" ? query.difficulty   : undefined;
  const petFriendly = query.petFriendly === "true"  ? true
                    : query.petFriendly === "false" ? false
                    : undefined;

  const where: any = { status: "ACTIVE" };

  if (city)        where.city        = { contains: city, mode: "insensitive" };
  if (type)        where.type        = type;
  if (q)           where.title       = { contains: q, mode: "insensitive" };
  if (watering)    where.watering    = watering;
  if (light)       where.light       = light;
  if (position)    where.position    = position;
  if (height)      where.height      = height;
  if (difficulty)  where.difficulty  = difficulty;
  if (petFriendly !== undefined) where.petFriendly = petFriendly;

  const [items, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        title: true,
        description: true,
        city: true,
        type: true,
        deliveryMode: true,
        watering: true,
        light: true,
        difficulty: true,
        createdAt: true,
        images: {
          select: { url: true, order: true },
          orderBy: { order: "asc" },
        },
        user: { select: { name: true } },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  return { page, pageSize, total, items };
});
