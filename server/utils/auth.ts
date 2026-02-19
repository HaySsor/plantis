import crypto from "node:crypto";

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getSessionExpiry(days = 30): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}
