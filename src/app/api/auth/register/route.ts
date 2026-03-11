import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const VALID_ROLES = ["USER", "ADMIN"] as const;
type Role = (typeof VALID_ROLES)[number];

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 }
    );
  }

  const resolvedRole: Role =
    role && VALID_ROLES.includes(role) ? role : "USER";

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: resolvedRole,
    },
  });

  return NextResponse.json({ message: "User registered successfully" });
}