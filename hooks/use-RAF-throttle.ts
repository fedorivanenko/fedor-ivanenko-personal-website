'use'

import * as React from 'react';

interface ThrottleOptions {
    fps?: number;
    enabled?: boolean;
}

interface ThrottleOptions {
    fps?: number;
    enabled?: boolean;
}

type CallbackFunction = () => void;

const useRafThrottle = (
    callback: CallbackFunction,
    options: ThrottleOptions = {}
): void => {
    const { fps = 60, enabled = true } = options;
    const frameRef = React.useRef<number>(0);
    const lastUpdateRef = React.useRef<number>(0);
    const callbackRef = React.useRef(callback);

    React.useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    React.useEffect(() => {
        if (!enabled) return;

        const frameInterval = 1000 / fps;

        const tick = (timestamp: number): void => {
            if (timestamp - lastUpdateRef.current >= frameInterval) {
                callbackRef.current();
                lastUpdateRef.current = timestamp;
            }
            frameRef.current = requestAnimationFrame(tick);
        };

        frameRef.current = requestAnimationFrame(tick);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [fps, enabled]);
};

export { useRafThrottle };