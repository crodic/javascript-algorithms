import { useEffect } from "react";
import { useState } from "react";

const useDebounce = (value, delay = 300) => {
    const [valueDebounce, setValueDebounce] = useState(value);

    useEffect(() => {
        let handler = setTimeout(() => {
            setValueDebounce(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return valueDebounce;
};

export default useDebounce;
