import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

const PUBLIC_PATHS = ["/", "/login", "/register", "/api/auth/login", "/api/auth/register", "/favicon.ico"];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const isPublic = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"));
  if (isPublic && pathname !== "/login") return NextResponse.next();

  // Redirect logged-in users away from login page
  if (pathname === "/login" && token) {
    try {
      const payload = await verifyToken(token);
      if (payload.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.redirect(new URL("/users/dashboard", req.url));
    } catch {
      return NextResponse.next();
    }
  }

  // Redirect /users to /users/dashboard
  if (pathname === "/users") {
    return NextResponse.redirect(new URL("/users/dashboard", req.url));
  }

  // Not logged in
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const payload = await verifyToken(token);

    if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/users/dashboard", req.url));
    }

    if (pathname.startsWith("/users") && payload.role !== "USER") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  } catch {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
