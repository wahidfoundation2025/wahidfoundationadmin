import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware({
  publicRoutes: ['/api(.*)'], // All API routes are public
})

export const config = {
  matcher: [
    // Apply middleware to everything except static files
    '/((?!_next|.*\\..*).*)',
  ],
}
