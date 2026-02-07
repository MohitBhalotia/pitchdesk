/**
 * Common type definitions for Next.js App Router route handlers
 * In Next.js 15+, params is now a Promise that must be awaited
 */

/**
 * Route context with dynamic [id] parameter
 * Usage: async function GET(req: NextRequest, context: RouteContext)
 */
export interface RouteContext {
    params: Promise<{ id: string }>;
}

/**
 * Route context with multiple dynamic parameters
 * Usage: async function GET(req: NextRequest, context: RouteContextMulti<{ slug: string; id: string }>)
 */
export interface RouteContextMulti<T extends Record<string, string>> {
    params: Promise<T>;
}
