import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
    //? Custom Session
    interface Session {
        user: {
            accessToken: string;
            refreshToken: string;
        } & DefaultSession['user'];
    }
    //? Custom User Authorized
    interface User {
        id: number;
        username: string;
        token: string;
        refreshToken: string;
        role: string;
    }
}

declare module 'next-auth/jwt' {
    //? Custom JWT in callback
    interface JWT {
        token: string;
        refreshToken: string;
        id?: string | number;
        error?: string;
    }
}
