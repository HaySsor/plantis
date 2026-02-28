import { prisma } from "../utils/prisma";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = Math.max(1, Number(query.page ?? 1));
  const pageSize = Math.min(50, Math.max(1, Number(query.pageSize ?? 12)));

  const city = typeof query.city === "string" ? query.city.trim() : undefined;
  const type = typeof query.type === "string" ? query.type : undefined;
  const q = typeof query.q === "string" ? query.q.trim() : undefined;

  const where: any = { status: "ACTIVE" };

  if (city) where.city = { contains: city, mode: "insensitive" };
  if (type) where.type = type;
  if (q) where.title = { contains: q, mode: "insensitive" };

  const [items, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
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
    }),
    prisma.listing.count({ where }),
  ]);

  return { page, pageSize, total, items };
});
