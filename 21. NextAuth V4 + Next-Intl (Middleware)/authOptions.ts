import { jwtDecode } from 'jwt-decode';
import { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        Credentials({
            name: 'Animazing',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'Enter you email' },
                password: { label: 'Password', type: 'password', placeholder: 'Enter your password' },
            },
            authorize: async (credentials, req) => {
                const res = await fetch('https://dummyjson.com/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: 'emilys',
                        password: 'emilyspass',
                        expiresInMins: 1, // optional, defaults to 60
                    }),
                });
                const user = await res.json();
                if (!res.ok) {
                    return null;
                }
                return { ...user, role: 'user' }; // Custom User in authorized
            },
        }),
    ],
    callbacks: {
        jwt: async ({ user, token }) => {
            if (user) {
                console.log('>>> First Login');
                token.id = user.id;
                token.name = user.username;
                token.token = user.token;
                token.refreshToken = user.refreshToken;
                token.role = user.role;
                return token;
            } else if (Date.now() < (jwtDecode(token.token).exp as number) * 1000) {
                console.log('>>> No Refresh Token');
                return token;
            } else {
                if (!token.token) throw new Error('Missing Token');
                console.log('>>> Refresh Token');
                const res = await fetch('https://dummyjson.com/auth/refresh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        refreshToken: token.refreshToken,
                        expiresInMins: 5, // optional, defaults to 60
                    }),
                });
                const payload = await res.json();
                if (!res.ok) {
                    console.log('>>> Refresh Token Failed');
                    throw new Error('RefreshTokenTokenFailed');
                }
                console.log('>>> Refresh Token Success');
                return {
                    ...token,
                    token: payload.token,
                };
            }
        },
        session: async (params) => {
            const { token, session } = params;
            session.user.token = token.token;
            session.user.refreshToken = token.refreshToken;
            session.user.error = token.error;
            return Promise.resolve(session);
        },
    },
};
