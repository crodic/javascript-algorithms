'use client';

import { authAxios } from '@/services/axios';
import { AxiosError } from 'axios';
import { signOut, useSession } from 'next-auth/react';

const useRefreshToken = () => {
    const { data: session, update } = useSession();
    const refreshToken = async () => {
        try {
            const res = await authAxios.post(
                '/api/v1/user/refresh-token-v2',
                { token: session?.refreshToken },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (session) {
                const token = (session.accessToken = res.data.token);
                const newSession = { ...session, accessToken: token };
                await update(newSession);
            }
        } catch (error) {
            const err = error as AxiosError;
            if (err?.response?.status === 401) {
                const errorMsg = 'Phiên Đăng Nhập Hết Hạn.';
                await signOut({ callbackUrl: encodeURI(`/login?error=${errorMsg}`) });
            }
        }
    };
    return refreshToken;
};

export default useRefreshToken;
