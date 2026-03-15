import { prisma } from "../../../../utils/prisma";
import { requireAdmin } from "../../../../utils/requireAdmin";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing id" });

  const { status } = await readBody(event);
  if (!["ACTIVE", "REJECTED"].includes(status)) {
    throw createError({ statusCode: 400, statusMessage: "Status must be ACTIVE or REJECTED" });
  }

  const listing = await prisma.listing.update({
    where: { id },
    data: { status },
    select: { id: true, status: true },
  });

  return { listing };
});
