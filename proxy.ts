import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/profile", "/profile/edit"];
const publicRoutes = ["/sign-in", "/sign-up"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  
  console.log("Proxy middleware: Checking auth for", pathname, "Token:", token);

  if (privateRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (publicRoutes.some((route) => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",  
    "/sign-in",
    "/sign-up"
  ],
};