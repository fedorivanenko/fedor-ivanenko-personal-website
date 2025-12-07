import { useSyncExternalStore } from "react";

export interface ScrollState {
    scrollX: number;
    scrollY: number;
    scrollXProgress: number;
    scrollYProgress: number;
    scrollXVelocity: number;
    scrollYVelocity: number;
    scrollXDirection: -1 | 0 | 1;
    scrollYDirection: -1 | 0 | 1;
}

interface ScrollStoreConfig {
    target: HTMLElement | null;
    container: HTMLElement | Window | null;
}

const clamp = (v: number) => Math.max(0, Math.min(1, v));

/** Type guard */
const isHTMLElement = (el: unknown): el is HTMLElement => 
    el instanceof HTMLElement;

const getDocumentElement = () =>
    document.scrollingElement ?? document.documentElement;

function readContainerScroll(container: HTMLElement | null): ScrollState {
    if (container) {
        const maxX = container.scrollWidth - container.clientWidth;
        const maxY = container.scrollHeight - container.clientHeight;

        const scrollX = container.scrollLeft;
        const scrollY = container.scrollTop;

        return {
            scrollX,
            scrollY,
            scrollXProgress: maxX <= 0 ? 0 : clamp(scrollX / maxX),
            scrollYProgress: maxY <= 0 ? 0 : clamp(scrollY / maxY),
            scrollXVelocity: 0,
            scrollYVelocity: 0,
            scrollXDirection: 0,
            scrollYDirection: 0,
        };
    }

    const doc = getDocumentElement();
    const scrollX = window.scrollX ?? window.pageXOffset;
    const scrollY = window.scrollY ?? window.pageYOffset;

    const maxX = doc.scrollWidth - window.innerWidth;
    const maxY = doc.scrollHeight - window.innerHeight;

    return {
        scrollX,
        scrollY,
        scrollXProgress: maxX <= 0 ? 0 : clamp(scrollX / maxX),
        scrollYProgress: maxY <= 0 ? 0 : clamp(scrollY / maxY),
        scrollXVelocity: 0,
        scrollYVelocity: 0,
        scrollXDirection: 0,
        scrollYDirection: 0,
    };
}

/**
 * Calculates viewport-relative progress for a target element.
 * Progress represents how much of the element has scrolled through the viewport:
 * - 0 = element bottom is at viewport top (entering)
 * - 1 = element top is at viewport bottom (exiting)
 */
function applyTargetProgress(
    values: ScrollState,
    target: HTMLElement | null,
    container: HTMLElement | null
): ScrollState {
    // When using a custom container, viewport-relative target progress
    // does not make sense (same as Framer Motion behavior).
    if (!target || container) return values;

    const rect = target.getBoundingClientRect();
    const vw = window.innerWidth || 1;
    const vh = window.innerHeight || 1;

    return {
        ...values,
        scrollXProgress: clamp((vw - rect.left) / (vw + rect.width)),
        scrollYProgress: clamp((vh - rect.top) / (vh + rect.height)),
    };
}

class ScrollStore {
    private state: ScrollState = {
        scrollX: 0,
        scrollY: 0,
        scrollXProgress: 0,
        scrollYProgress: 0,
        scrollXVelocity: 0,
        scrollYVelocity: 0,
        scrollXDirection: 0,
        scrollYDirection: 0,
    };

    private listeners = new Set<() => void>();
    private frame: number | null = null;
    private config: ScrollStoreConfig = {
        target: null,
        container: null,
    };
    private cleanup: (() => void) | null = null;
    private initialized = false;
    
    // Velocity tracking
    private lastScrollX = 0;
    private lastScrollY = 0;
    private lastTimestamp = 0;

    configure(opts: Partial<ScrollStoreConfig>) {
        const configChanged = 
            opts.target !== this.config.target ||
            opts.container !== this.config.container;

        this.config = {
            target: opts.target ?? null,
            container: opts.container ?? null,
        };

        // Reinitialize if config changed and we're already initialized
        if (configChanged && this.initialized) {
            this.cleanup?.();
            this.initialized = false;
            this.initEvents();
        }
    }

    private calculateVelocity(
        currentX: number,
        currentY: number,
        timestamp: number
    ): Pick<ScrollState, 'scrollXVelocity' | 'scrollYVelocity' | 'scrollXDirection' | 'scrollYDirection'> {
        // First call - no velocity yet
        if (this.lastTimestamp === 0) {
            this.lastScrollX = currentX;
            this.lastScrollY = currentY;
            this.lastTimestamp = timestamp;
            return {
                scrollXVelocity: 0,
                scrollYVelocity: 0,
                scrollXDirection: 0,
                scrollYDirection: 0,
            };
        }

        const deltaTime = timestamp - this.lastTimestamp;
        
        // Prevent division by zero
        if (deltaTime === 0) {
            return {
                scrollXVelocity: this.state.scrollXVelocity,
                scrollYVelocity: this.state.scrollYVelocity,
                scrollXDirection: this.state.scrollXDirection,
                scrollYDirection: this.state.scrollYDirection,
            };
        }

        const deltaX = currentX - this.lastScrollX;
        const deltaY = currentY - this.lastScrollY;

        // Velocity in pixels per millisecond
        const velocityX = deltaX / deltaTime;
        const velocityY = deltaY / deltaTime;

        // Direction: -1 (left/up), 0 (no movement), 1 (right/down)
        const directionX = deltaX < 0 ? -1 : deltaX > 0 ? 1 : 0;
        const directionY = deltaY < 0 ? -1 : deltaY > 0 ? 1 : 0;

        this.lastScrollX = currentX;
        this.lastScrollY = currentY;
        this.lastTimestamp = timestamp;

        return {
            scrollXVelocity: velocityX,
            scrollYVelocity: velocityY,
            scrollXDirection: directionX as -1 | 0 | 1,
            scrollYDirection: directionY as -1 | 0 | 1,
        };
    }

    private update = () => {
        const timestamp = performance.now();
        const containerForCalc = isHTMLElement(this.config.container)
            ? this.config.container
            : null;

        const base = readContainerScroll(containerForCalc);
        const withTarget = applyTargetProgress(
            base,
            this.config.target,
            containerForCalc
        );

        // Calculate velocity and direction
        const velocityData = this.calculateVelocity(
            withTarget.scrollX,
            withTarget.scrollY,
            timestamp
        );

        const next = {
            ...withTarget,
            ...velocityData,
        };

        // Dedup — prevent unnecessary listener executions
        if (
            next.scrollX === this.state.scrollX &&
            next.scrollY === this.state.scrollY &&
            next.scrollXProgress === this.state.scrollXProgress &&
            next.scrollYProgress === this.state.scrollYProgress &&
            next.scrollXVelocity === this.state.scrollXVelocity &&
            next.scrollYVelocity === this.state.scrollYVelocity &&
            next.scrollXDirection === this.state.scrollXDirection &&
            next.scrollYDirection === this.state.scrollYDirection
        ) {
            return;
        }

        this.state = next;
        this.listeners.forEach((fn) => fn());
    };

    private scheduleUpdate = () => {
        if (this.frame !== null) return;
        this.frame = requestAnimationFrame(() => {
            this.frame = null;
            this.update();
        });
    };

    subscribe = (fn: () => void) => {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    };

    getSnapshot = (): ScrollState => {
        return this.state;
    };

    initEvents() {
        if (this.initialized || typeof window === "undefined") return;
        this.initialized = true;

        const scrollSource = this.config.container ?? window;

        scrollSource.addEventListener("scroll", this.scheduleUpdate, {
            passive: true,
        });
        window.addEventListener("resize", this.scheduleUpdate);

        this.cleanup = () => {
            scrollSource.removeEventListener("scroll", this.scheduleUpdate);
            window.removeEventListener("resize", this.scheduleUpdate);
            
            // Cancel any pending frame
            if (this.frame !== null) {
                cancelAnimationFrame(this.frame);
                this.frame = null;
            }
            
            // Reset velocity tracking
            this.lastScrollX = 0;
            this.lastScrollY = 0;
            this.lastTimestamp = 0;
        };
    }

    destroy() {
        this.cleanup?.();
        this.listeners.clear();
        this.initialized = false;
    }
}

// Store registry to support multiple independent scroll trackers
const stores = new Map<string, ScrollStore>();

function getStoreKey(config: Partial<ScrollStoreConfig>): string {
    // Create unique key based on target and container references
    const targetId = config.target ? `t${config.target.dataset.scrollId || Math.random()}` : 'null';
    const containerId = config.container instanceof HTMLElement 
        ? `c${config.container.dataset.scrollId || Math.random()}`
        : config.container === window 
        ? 'window' 
        : 'null';
    
    return `${targetId}-${containerId}`;
}

function getOrCreateStore(config: Partial<ScrollStoreConfig>): ScrollStore {
    const key = getStoreKey(config);
    
    if (!stores.has(key)) {
        const store = new ScrollStore();
        store.configure(config);
        store.initEvents();
        stores.set(key, store);
    }
    
    return stores.get(key)!;
}

/* PUBLIC API */
export function useScrollStore(config: Partial<ScrollStoreConfig> = {}) {
    const store = getOrCreateStore(config);
    
    return useSyncExternalStore(
        store.subscribe,
        store.getSnapshot,
        store.getSnapshot
    );
}

/* Cleanup utilities */
export function destroyScrollStore(config: Partial<ScrollStoreConfig>) {
    const key = getStoreKey(config);
    const store = stores.get(key);
    
    if (store) {
        store.destroy();
        stores.delete(key);
    }
}

export function destroyAllScrollStores() {
    stores.forEach(store => store.destroy());
    stores.clear();
}