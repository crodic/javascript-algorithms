import axios from 'axios';
import { handleLogoutApi, refreshTokenApi } from '~/apis';

const axiosInstant = axios.create({
    timeout: 10 * 60 * 1000,
    withCredentials: true,
});

//? Xử lý request trước khi gửi đi
axiosInstant.interceptors.request.use(
    (config) => {
        //? 2. Gán Token vào Header
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        //? Do something with request error
        return Promise.reject(error);
    }
);

//? Khởi tạo 1 promise cho việc gọi refresh token
//? Mục đích của Promise này để khi nhận request refreshToken đầu tiên thì sẽ hold lại việc gọi API refresh token
//? cho tới xong thì mới retry lại những api bị lỗi trước đó thay vì cứ gọi lại liên tục
let refreshTokenPromise = null;

//? Xử lý response trước khi nhận lại
axiosInstant.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        //* Token hết hạn trả về 401 => Ko truyền token => Ko cần refresh => Logout
        if (error.response.status === 401) {
            handleLogoutApi().then(() => {
                location.href = '/login';
            });
        }

        // ----------------------------------------
        //? Xử lý lỗi tập trung

        //* Xử lý refresh token (410)
        const originalRequest = error.config;

        if (error.response.status === 410 && originalRequest) {
            if (!refreshTokenPromise) {
                const refreshToken = localStorage.getItem('refreshToken');

                //? Khai báo hàm refreshTokenApi và gán vào promise
                refreshTokenPromise = refreshTokenApi(refreshToken)
                    .then((res) => {
                        const accessToken = res.data.accessToken;
                        localStorage.setItem('accessToken', accessToken);

                        //? Gán token lại vào headers
                        axiosInstant.defaults.headers.Authorization = `Bearer ${accessToken}`;
                    })
                    .catch((_error) => {
                        //! Mọi lỗi trả về đều logout
                        handleLogoutApi().then(() => {
                            location.href = '/login';
                        });
                        return Promise.reject(_error);
                    })
                    .finally(() => {
                        //* Phương thức .finally() chỉ chạy sau khi promise đã hoàn thành (bất kể thành công hay thất bại).
                        //* Do đó, refreshTokenPromise = null chỉ chạy sau khi promise từ refreshTokenApi(refreshToken) hoàn tất.
                        refreshTokenPromise = null;
                    });
            }

            //* Dòng này được thực thi ngay sau khi refreshTokenPromise được khởi tạo, nhưng trước khi promise hoàn thành.
            //* Bởi vì lời gọi refreshTokenApi(refreshToken) là bất đồng bộ, JavaScript tiếp tục chạy các dòng tiếp theo mà không chờ promise hoàn thành.

            //? Return refreshTokenPromise trong truong hợp success
            return refreshTokenPromise.then(() => {
                return axiosInstant(originalRequest);
            });
        }

        return Promise.reject(error);
    }
);

export default axiosInstant;
