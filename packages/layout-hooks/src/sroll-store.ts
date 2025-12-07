import { useSyncExternalStore } from "react";

export interface ScrollState {
    scrollX: number;
    scrollY: number;
    scrollXProgress: number;
    scrollYProgress: number;
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
    };

    private listeners = new Set<() => void>();
    private frame: number | null = null;
    private config: ScrollStoreConfig = {
        target: null,
        container: null,
    };
    private cleanup: (() => void) | null = null;
    private initialized = false;

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

    private update = () => {
        const containerForCalc = isHTMLElement(this.config.container)
            ? this.config.container
            : null;

        const base = readContainerScroll(containerForCalc);
        const next = applyTargetProgress(
            base,
            this.config.target,
            containerForCalc
        );

        // Dedup — prevent unnecessary listener executions
        if (
            next.scrollX === this.state.scrollX &&
            next.scrollY === this.state.scrollY &&
            next.scrollXProgress === this.state.scrollXProgress &&
            next.scrollYProgress === this.state.scrollYProgress
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

/* Public API */

export function useScrollStore(config: Partial<ScrollStoreConfig> = {}) {
    const store = getOrCreateStore(config);
    
    return useSyncExternalStore(
        store.subscribe,
        store.getSnapshot, // Client Snapshot
        store.getSnapshot  // Server snapshot
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