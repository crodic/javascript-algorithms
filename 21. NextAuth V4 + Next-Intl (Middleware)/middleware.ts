import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { getToken } from 'next-auth/jwt';

const locales = ['en', 'vi', 'jp'];

// Ngoại trừ register/login page
const publicPages = ['/'];

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
    console.log('------- Vào Middleware ----------');
    const token = await getToken({ req });
    const isAuthenticated = !!token;

    // Chặn truy cập page Login/Register khi đã đăng nhập
    const isLoginOrRegisterPathnameRegex = /^(\/(en|vi))?(\/register|\/login)+\/?$/i;
    // Page không cần đăng nhập vẫn truy cập được
    const publicPathnameRegex = RegExp(
        `^(/(${locales.join('|')}))?(${publicPages.flatMap((p) => (p === '/' ? ['', '/'] : p)).join('|')})/?$`,
        'i'
    );

    const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname); // URL public
    const isLoginOrRegisterPage = isLoginOrRegisterPathnameRegex.test(req.nextUrl.pathname); // URL block

    // Nếu là public page thì không cần xác thực
    if (isPublicPage) {
        console.log('Trang không xác thực: ', req.nextUrl.pathname);
        return intlMiddleware(req);
    }

    // Nếu vào page login/register khi đã đăng nhập sẽ redirect
    if (isLoginOrRegisterPage) {
        if (isAuthenticated) {
            console.log('Chặn Page Login:', req.nextUrl.pathname);
            return NextResponse.redirect(new URL('/', req.url));
        }
        console.log('Đây là trang đăng nhập.');
        return intlMiddleware(req);
    }

    console.log('Xác thực: ', req.nextUrl.pathname);
    // Các page còn lại sẽ xác thực
    return (authMiddleware as any)(req);
}

export const config = {
    // Skip all paths that should not be internationalized
    matcher: ['/((?!api|_next|.*\\..*).*)'],
};

/**
 *
 * Trang xác thực: /private
 * Trang không xác thực: /
 * Trang bị chặn khi đã login: /login, /register
 *
 */
