import { useSearchParams } from "react-router-dom";

const useQuerySearch = (key) => {
    const [searchParams] = useSearchParams();
    const value = searchParams.get(key) ? searchParams.get(key) : null;
    return value;
};

export default useQuerySearch;
