import { useEffect } from "react";
import { useState } from "react";

const useAxios = (callback, initState = "") => {
    const [data, setData] = useState(initState);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        fetchAxios();
    }, []);

    const fetchAxios = async () => {
        setIsLoading(true);
        try {
            let res = await callback();
            if (res && res.status === 200) {
                setIsLoading(true);
                setData(res.data);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            setIsError(true);
        }
    };

    return [data, isLoading, isError];
};

export default useAxios;
