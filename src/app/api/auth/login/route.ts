import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const { email, password, expectedRole } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  if (expectedRole && user.role !== expectedRole) {
    return NextResponse.json(
      { error: `Account exists but is not registered as ${expectedRole}` },
      { status: 403 }
    );
  }

  const token = await signToken({ userId: user.id, role: user.role });

  const res = NextResponse.json({
    role: user.role,
  });

  res.cookies.set("auth-token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  return res;
}
