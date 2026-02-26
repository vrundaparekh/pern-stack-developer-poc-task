import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define public routes that don't need a login (like your Home and API)
const isPublicRoute = createRouteMatcher(['/', '/api/[[...route]]']);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect(); // Protect all other routes
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};