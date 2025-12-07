import { useEffect, useState, RefObject } from "react";

export function useIsHydrated(ref: RefObject<HTMLElement | null>) {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        if (ref.current) {
            setIsHydrated(true);
        }
    }, [ref]);

    return isHydrated;
}