import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const { email, password } = await req.json();

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

  const res = NextResponse.json({
    role: user.role,
  });

const token = await signToken({ userId: user.id, role: user.role });

res.cookies.set("token", token, {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
});

  return res;
}
