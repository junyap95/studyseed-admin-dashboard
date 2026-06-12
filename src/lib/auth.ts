import { jwtVerify, SignJWT } from "jose";

let cachedSecret: Uint8Array | undefined;

export function getSecret(): Uint8Array {
  if (cachedSecret) return cachedSecret;

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  cachedSecret = new TextEncoder().encode(jwtSecret);
  return cachedSecret;
}

export async function verifyAuthToken(token: string) {
  const verifiedToken = await jwtVerify(token, getSecret(), {
    algorithms: ["HS256"],
  });
  return verifiedToken;
}

export async function signAuthToken(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getSecret());
}
