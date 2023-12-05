import { useEffect } from "react";

const useClickOutSide = (ref, callback) => {
    const handleClickOutSide = (e) => {
        if (ref?.current && !ref.current.contains(e.target)) {
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutSide);

        return () => document.removeEventListener("click", handleClickOutSide);
    }, [ref, callback]);
};

export default useClickOutSide;
