import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";
 
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
 
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
 
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = generateToken({
        id: "admin-id",
        role: "ADMIN",
      });
 
      const response = NextResponse.json({
        message: "Admin login successful",
        role: "ADMIN",
      });
 
      response.cookies.set("token", token, {
        httpOnly: true,
        path: "/",
      });
 
      return response;
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });
 
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }
 
    const isMatch = await bcrypt.compare(password, user.password);
 
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }
 
    const token = generateToken({
      id: user.id,
      role: "USER",
    });
 
    const response = NextResponse.json({
      message: "Login successful",
      role: "USER",
    });
 
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
    });
 
    return response;
 
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
 