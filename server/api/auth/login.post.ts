import argon2 from "argon2";
import { prisma } from "../../utils/prisma";
import {
  generateSessionToken,
  getSessionExpiry,
  hashToken,
} from "../../utils/auth";

type LoginBody = {
  email?: string;
  password?: string;
};

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as LoginBody;

  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required",
    });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Avoid leaking which emails exist
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  }

  const ok = await argon2.verify(user.passwordHash, password);
  if (!ok) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  }

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
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return { user: { id: user.id, email: user.email, name: user.name } };
});
