import argon2 from "argon2";
import { prisma } from "../../utils/prisma";

type RegisterBody = {
  email?: string;
  password?: string;
};

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as RegisterBody;

  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required",
    });
  }

  if (password.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: "Password must be at least 8 characters",
    });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: "User already exists",
    });
  }

  const passwordHash = await argon2.hash(password);

  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true, createdAt: true },
  });

  return { user };
});
