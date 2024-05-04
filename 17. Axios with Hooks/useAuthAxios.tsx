'use client';

import { useSession } from 'next-auth/react';
import useRefreshToken from './useRefreshToken';
import { useEffect } from 'react';
import { authAxios } from '@/services/axios';

const useAuthAxios = () => {
    const { data: session } = useSession();
    const refreshToken = useRefreshToken();

    useEffect(() => {
        const requestInterceptor = authAxios.interceptors.request.use(
            (config) => {
                if (!config.headers['Authorization']) {
                    config.headers.Authorization = `Bearer ${session?.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = authAxios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response.status === 403 && !originalRequest?.sent) {
                    originalRequest.sent = true;
                    await refreshToken();
                    originalRequest.headers.Authorization = `Bearer ${session?.accessToken}`;
                    return authAxios(originalRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            authAxios.interceptors.request.eject(requestInterceptor);
            authAxios.interceptors.response.eject(responseInterceptor);
        };
    }, [session, refreshToken]);

    return authAxios;
};

export default useAuthAxios;
