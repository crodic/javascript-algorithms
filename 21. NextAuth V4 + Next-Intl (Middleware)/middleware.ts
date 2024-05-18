import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { getToken } from 'next-auth/jwt';

const locales = ['en', 'vi', 'jp'];

// Đường dẫn public
const publicPages = ['/login'];

const intlMiddleware = createIntlMiddleware({
    locales,
    localePrefix: 'as-needed',
    defaultLocale: 'en',
});

const authMiddleware = withAuth(
    function onSuccess(req) {
        return intlMiddleware(req);
    },
    {
        callbacks: {
            authorized: async ({ token }) => {
                return token != null;
            },
        },
        pages: {
            signIn: '/login',
        },
    }
);

export default async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const isAuthenticated = !!token;

    // Chặn truy cập page Login/Register khi đã đăng nhập
    const unAuthenticatedPathnameRegex = /^(\/(en|vi))?(\/register|\/login)+\/?$/i;
    // Page không cần đăng nhập vẫn truy cập được
    const publicPathnameRegex = RegExp(
        `^(/(${locales.join('|')}))?(${publicPages.flatMap((p) => (p === '/' ? ['', '/'] : p)).join('|')})/?$`,
        'i'
    );

    const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname); // URL public
    const isUnAuthenticatedPage = unAuthenticatedPathnameRegex.test(req.nextUrl.pathname); // URL block

    // Nếu là public page thì không cần xác thực
    if (isPublicPage) {
        return intlMiddleware(req);
    }

    // Nếu vào page login/register khi đã đăng nhập sẽ redirect
    if (isUnAuthenticatedPage) {
        if (isAuthenticated) return NextResponse.redirect(new URL('/', req.url));
        return intlMiddleware(req);
    }

    // Các page còn lại sẽ xác thực
    return (authMiddleware as any)(req);
}

export const config = {
    // Skip all paths that should not be internationalized
    matcher: ['/((?!api|_next|.*\\..*).*)'],
};
