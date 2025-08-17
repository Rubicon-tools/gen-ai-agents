import { NextRequest, NextResponse } from 'next/server'

// This is the required middleware export
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Matcher configuration: run on dynamic routes and APIs
export const config = {
  matcher: [
    // Skip static/internal assets unless they appear in query params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always run for API and trpc
    "/(api|trpc)(.*)",
  ],
}
