import { detectBot } from '@arcjet/next';
import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import arcjet from '@/libs/Arcjet';
import { routing } from './libs/I18nRouting';

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = (pathname: string) => {
  return pathname.includes('/dashboard');
};

const isAuthPage = (pathname: string) => {
  return pathname.includes('/sign-in') || pathname.includes('/sign-up');
};

// Improve security with Arcjet
const aj = arcjet.withRule(
  detectBot({
    mode: 'LIVE',
    allow: [
      'CATEGORY:SEARCH_ENGINE', // Allow search engines
      'CATEGORY:PREVIEW', // Allow preview links to show OG images
      'CATEGORY:MONITOR', // Allow uptime monitoring services
    ],
  }),
);

export default async function middleware(request: NextRequest) {
  // Verify the request with Arcjet
  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const pathname = request.nextUrl.pathname;

  if (isProtectedRoute(pathname)) {
    const token = request.cookies.get('user_session')?.value;
    if (!token) {
      // Find locale
      const localeMatch = pathname.match(/^\/([^/]+)/u);
      const locale = localeMatch ? localeMatch[1] : 'en';
      const signInUrl = new URL(`/${locale}/sign-in`, request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (isAuthPage(pathname)) {
    const token = request.cookies.get('user_session')?.value;
    if (token) {
      const localeMatch = pathname.match(/^\/([^/]+)/u);
      const locale = localeMatch ? localeMatch[1] : 'en';
      const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: '/((?!_next|_vercel|monitoring|api|.*\\..*).*)',
};
