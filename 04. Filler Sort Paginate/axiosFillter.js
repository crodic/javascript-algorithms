export const fetchProduct = (params) => {
    const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    return axios.get(`/product/index.php?action=get-all&${queryString}`);
};
