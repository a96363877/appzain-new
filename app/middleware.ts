import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function detects if the request is coming from a mobile device
function isMobileDevice(userAgent: string): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

export function middleware(request: NextRequest) {
  // Get the user agent from the request headers
  const userAgent = request.headers.get("user-agent") || ""

  // Check if the user is on a mobile device
  const isMobile = isMobileDevice(userAgent)

  // If not on mobile and not already on the restricted page, redirect to restricted page
  if (!isMobile && !request.nextUrl.pathname.startsWith("/home")) {
    return NextResponse.redirect(new URL("/home", request.url))
  }

  return NextResponse.next()
}

// Apply this middleware to all routes except for the restricted page and API routes
export const config = {
  matcher: ["/((?!restricted|api|_next/static|_next/image|favicon.ico).*)"],
}
