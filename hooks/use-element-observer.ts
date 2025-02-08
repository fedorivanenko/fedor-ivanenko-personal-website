'use client'

import * as React from 'react'

import { create } from "zustand";

export interface Metrics {
    start: { x: number; y: number };
    end: { x: number; y: number };
   // dimensions: { x: number; y: number };
   // mid: { x: number; y: number };
}

interface State {
    metrics: Record<string, Metrics>;
    setMetrics: (id: string, metrics: Metrics) => void;
}

const useElementStore = create<State>((set) => ({
    metrics: {},
    setMetrics: (id: string, metrics: Metrics) => set((state) => ({
        metrics: { ...state.metrics, [id]: metrics },
    })),
}));

const useCreateElementObserver = (id: string, elementRef: React.RefObject<HTMLElement | null>) => {

    const setMetrics = useElementStore((state) => state.setMetrics);
    
    const updatePending = React.useRef(false)
    
    const updateElement = React.useCallback(() => {
        if (!elementRef.current) return
        const rect = elementRef.current.getBoundingClientRect();
        setMetrics(id, {
            start: { x: rect.left, y: rect.top },
            end: { x: rect.right, y: rect.bottom },
        });
        updatePending.current = false;
    }, [elementRef, setMetrics, id]);

    const handleElementUpdate = React.useCallback(() => {
        if (!updatePending.current) {
            updatePending.current = true
            requestAnimationFrame(updateElement)
        }
    }, [updateElement])

    React.useEffect(() => {
        if (!elementRef.current) return;

        const resizeObserver = new ResizeObserver(() => {
            handleElementUpdate();
        });

        handleElementUpdate();

        resizeObserver.observe(elementRef.current);

        window.addEventListener('resize', handleElementUpdate);
        window.addEventListener('scroll', handleElementUpdate);

        return () => {
            window.removeEventListener('resize', handleElementUpdate);
            window.removeEventListener('scroll', handleElementUpdate);
            resizeObserver.disconnect();
            updatePending.current = false;
        }
    }, [elementRef, handleElementUpdate]);

    React.useEffect(() => {
        if (process.env.NODE_ENV !== 'production') {
          let timeoutId: NodeJS.Timeout;
          
          if (!elementRef.current) {
            timeoutId = setTimeout(() => {
              console.warn(
                `Element ref for id "${id}" is still null after initial render.\n` +
                'This usually means the element is either:\n' +
                '1. Rendered conditionally (e.g., inside an if statement)\n' +
                '2. Not mounted yet\n' +
                'Component tree state:', 
                elementRef?.current?.closest('#root')?.innerHTML || 'Root not found'
              );
            }, 1000);
          }
    
          return () => {
            if (timeoutId) clearTimeout(timeoutId);
          };
        }
      }, [id, elementRef]);

    return null
};

const useElementObserver = (id:string) => {
    const metrics = useElementStore((state) => state.metrics[id]);
    return metrics || {
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
        mid: { x: 0, y: 0, },
        dimensions: { x: 0, y: 0 }
    };
}

export { useCreateElementObserver, useElementObserver }