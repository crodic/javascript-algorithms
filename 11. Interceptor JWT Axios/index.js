import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { resetCart } from '~/redux/features/cartSlice';
import { logout, updateAccessToken, updateRefreshToken } from '~/redux/features/userSlice';

let store;

// Take Store in store.jsx (Using function in store.js - input store)
export const injectStore = (_store) => {
    store = _store;
};

const authAxios = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 10000,
});

authAxios.interceptors.request.use(
    async (config) => {
        const { refreshToken, accessToken } = store.getState().user;
        if (refreshToken && accessToken) {
            const date = new Date();
            const decode = jwtDecode(accessToken);
            const decodeRefresh = jwtDecode(refreshToken);
            if (decode.exp < date.getTime() / 1000) {
                if (decodeRefresh.exp > date.getTime() / 1000) {
                    try {
                        let response = await axios.post(
                            `${import.meta.env.VITE_BASE_URL}/user/index.php?action=token`,
                            {},
                            {
                                headers: {
                                    Authorization: `Bearer ${refreshToken}`,
                                },
                            }
                        );
                        store.dispatch(updateAccessToken(response.data.accessToken));
                        store.dispatch(updateRefreshToken(response.data.refreshToken));
                        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
                    } catch (err) {
                        store.dispatch(logout());
                        store.dispatch(resetCart());
                        return config;
                    }
                } else {
                    store.dispatch(logout());
                    store.dispatch(resetCart());
                }
            }
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

authAxios.interceptors.response.use(
    (response) => {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default authAxios;
