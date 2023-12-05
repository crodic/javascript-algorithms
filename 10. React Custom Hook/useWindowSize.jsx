import { useEffect } from "react";
import { useState } from "react";

const useWindowSize = () => {
    const isClient = typeof window === "object";

    const getSize = () => {
        return {
            width: isClient ? window.innerWidth : undefined,
            height: isClient ? window.innerHeight : undefined,
        };
    };

    const [windowSize, setWindowSize] = useState(getSize);

    useEffect(() => {
        if (!isClient) return false;

        window.addEventListener("resize", handleResize);

        return () => removeEventListener("resize", handleResize);
    }, []);

    const handleResize = () => {
        setWindowSize(getSize());
    };

    return windowSize;
};

export default useWindowSize;
