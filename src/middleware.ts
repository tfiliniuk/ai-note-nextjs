import {
  clerkMiddleware,
  createRouteMatcher,
  ClerkMiddlewareAuth,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

const afterAuth = async (auth: ClerkMiddlewareAuth) => {
  const { userId } = auth();
  console.log("afterAuth logic", userId);

  return NextResponse.next();
};

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }

  return afterAuth(auth);
});

export const config = {
  matcher: [
    // // Skip Next.js internals and all static files, unless found in search params
    // "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // // Always run for API routes
    // "/(api|trpc)(.*)",

    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
