import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up", "/", "/verify/:path*"],
};

export default auth((request) => {
  // console.log(`middleware's request`,request)
  const url = request.nextUrl;
  // console.log(`anshubhai`,url)

  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    (request.auth &&
      (url.pathname.startsWith("/sign-in") ||
        url.pathname.startsWith("/sign-up") ||
        url.pathname.startsWith("/verify")))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!request.auth && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
});
