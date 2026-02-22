import argon2 from "argon2";
import { prisma } from "../../utils/prisma";
import {
  generateSessionToken,
  getSessionExpiry,
  hashToken,
} from "../../utils/auth";

type RegisterBody = {
  email?: string;
  password?: string;
  name?: string;
};

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as RegisterBody;

  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  const name = body.name?.trim();

  if (!name || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Name, email and password are required",
    });
  }

  if (name.length < 2) {
    throw createError({
      statusCode: 400,
      statusMessage: "Name must be at least 2 characters",
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
    data: { email, passwordHash, name },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  const token = generateSessionToken();
  const tokenHash = hashToken(token);

  await prisma.session.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: getSessionExpiry(30),
    },
  });

  setCookie(event, "session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });

  return { user };
});
