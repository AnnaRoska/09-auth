import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/profile/edit", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();

  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  console.log(
    "Proxy middleware:",
    pathname,
    "accessToken:",
    !!accessToken,
    "refreshToken:",
    !!refreshToken
  );

  if (!accessToken && refreshToken) {
    try {
      const session = await checkSession();

      if (session?.accessToken) {
        accessToken = session.accessToken;

        const response = NextResponse.next();

        response.cookies.set("accessToken", session.accessToken, {
          httpOnly: true,
          path: "/",
        });

        if (session.refreshToken) {
          response.cookies.set("refreshToken", session.refreshToken, {
            httpOnly: true,
            path: "/",
          });
        }

        return response;
      }
    } catch (error) {
      console.log("Session refresh failed:", error);
    }
  }

  if (
    privateRoutes.some((route) => pathname.startsWith(route)) &&
    !accessToken
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (
    publicRoutes.some((route) => pathname.startsWith(route)) &&
    accessToken
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};