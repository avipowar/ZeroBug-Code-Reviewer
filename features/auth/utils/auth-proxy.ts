import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getSafeCallbackPath, SIGN_IN_PATH } from ".";

function redirectToSignIn(request: NextRequest, pathName: string) {
  const signInUrl = new URL(SIGN_IN_PATH, request.url);

  // include query string so filters/search params survive the round-trip through sign-in
  signInUrl.searchParams.set(
    "callbackUrl",
    `${pathName}${request.nextUrl.search}`,
  );

  return NextResponse.redirect(signInUrl);
}

function getPostAuthRedirectPath(request: NextRequest) {
  const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
  return getSafeCallbackPath(callbackUrl);
}

//  "/" is always public
// "/sign-in"

export async function handleAuthProxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (pathname === SIGN_IN_PATH) {
    if (session) {
      const redirectPath = getPostAuthRedirectPath(request);

      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.next();
  }

  if (!session) {
    return redirectToSignIn(request, pathname);
  }

  return NextResponse.next();
}
