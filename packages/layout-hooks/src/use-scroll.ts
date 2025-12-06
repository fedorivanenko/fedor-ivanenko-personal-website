'use client'

import { RefObject } from "react";
import { useScrollStore, ScrollState } from "./sroll-store";

export interface UseScrollOptions {
    target?: RefObject<HTMLElement>;
    container?: RefObject<HTMLElement>;
    disabled?: boolean;
}

const DISABLED_STATE: ScrollState = {
    scrollX: 0,
    scrollY: 0,
    scrollXProgress: 0,
    scrollYProgress: 0,
};

export function useScroll(options: UseScrollOptions = {}): ScrollState {
    const { target, container, disabled } = options;

    // Return zero state when disabled
    if (disabled) {
        return DISABLED_STATE;
    }

    const resolvedTarget = target?.current ?? null;
    const resolvedContainer = container?.current ?? null;

    // The store now handles its own initialization and cleanup
    return useScrollStore({
        target: resolvedTarget,
        container: resolvedContainer,
    });
}