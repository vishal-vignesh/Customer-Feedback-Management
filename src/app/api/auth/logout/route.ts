import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ message: "Logged out successfully" });

    res.cookies.delete("auth-token");

    // Keep these just in case old cookies exist from previous version
    res.cookies.delete("userId");
    res.cookies.delete("role");

    return res;
}
