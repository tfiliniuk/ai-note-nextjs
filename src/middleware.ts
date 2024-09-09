import {
  clerkMiddleware,
  createRouteMatcher,
  // ClerkMiddlewareAuth,
} from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

// const afterAuth = async (auth: ClerkMiddlewareAuth) => {
//   const { userId } = auth();
//   console.log("afterAuth logic", userId);

//   return NextResponse.next();
// };

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }

  // return afterAuth(auth);
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
