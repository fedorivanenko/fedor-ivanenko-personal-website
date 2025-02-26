'use client'

import * as React from 'react'
import { create } from "zustand";

interface PointerState {
    current: { x: number; y: number };
    lastClick: { x: number; y: number } | null;
    lastTap: { x: number; y: number } | null;
    setPointer: (position: { x: number; y: number }, type?: 'click' | 'tap') => void;
}

const usePointerStore = create<PointerState>((set) => ({
    current: { x: 0, y: 0 },
    lastClick: null,
    lastTap: null,
    setPointer: (position, type) => set(state => ({
        current: position,
        lastClick: type === 'click' ? position : state.lastClick,
        lastTap: type === 'tap' ? position : state.lastTap
    }))
}));

const PointerObserver = () => {
    const updatePending = React.useRef(false);
    const setPointer = usePointerStore(state => state.setPointer);

    React.useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            if (!updatePending.current) {
                updatePending.current = true;
                requestAnimationFrame(() => {
                    setPointer({ x: e.clientX, y: e.clientY });
                    updatePending.current = false;
                });
            }
        };

        const handleClick = (e: MouseEvent) => {
            setPointer({ x: e.clientX, y: e.clientY }, 'click');
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (e.changedTouches[0]) {
                const touch = e.changedTouches[0];
                setPointer({ x: touch.clientX, y: touch.clientY }, 'tap');
            }
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('click', handleClick);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('click', handleClick);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [setPointer]);

    return null
}; 

const usePointerObserver = () => {
    return usePointerStore(state => state.current);
}

export { PointerObserver, usePointerObserver };