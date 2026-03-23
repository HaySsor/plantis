import { prisma } from "../utils/prisma";

export default defineEventHandler(async () => {
  const [listingsCount, usersCount, cities] = await Promise.all([
    prisma.listing.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.listing.findMany({
      where: { status: "ACTIVE" },
      select: { city: true },
      distinct: ["city"],
    }),
  ]);

  return {
    listings: listingsCount,
    users: usersCount,
    cities: cities.length,
  };
});
