import { NextResponse, NextRequest } from "next/server";

const privateRoutes = ["/profile", "/profile/edit"];
const publicRoutes = ["/sign-in", "/sign-up"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );


  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}