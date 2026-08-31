import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIE_NAME } from "@/lib/auth";

function safeCompare(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export async function POST(request: NextRequest) {
  const sitePassword = process.env.SITE_PASSWORD;
  const cookieSecret = process.env.COOKIE_SECRET;

  if (!sitePassword || !cookieSecret) {
    return NextResponse.json(
      { error: "서버에 SITE_PASSWORD 또는 COOKIE_SECRET이 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!password || !safeCompare(password, sitePassword)) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE_NAME, cookieSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE,
  });
  return response;
}
