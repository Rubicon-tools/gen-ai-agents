import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/signin",
  "/signup",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  
  if (!userId) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};