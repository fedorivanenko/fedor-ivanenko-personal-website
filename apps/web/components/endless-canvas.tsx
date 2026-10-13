"use client";

import {
  EnterFullScreenIcon,
  FileTextIcon,
  TargetIcon,
} from "@radix-ui/react-icons";
import * as React from "react";

import { DocumentModals } from "@/components/document-modal";
import { FolderIcon } from "@/components/icons";
import ThemeToggle from "@/components/theme-toggle";

import {
  layoutVisibleNodes,
  NODE_HEIGHT,
  nodeById,
} from "@/content/filesystem";

const MIN_SCALE = 0.35;
const MAX_SCALE = 1.6;
const TAP_SLOP = 8;

const ROW_TRAVEL_DURATION = 36;
const VIEWPORT_ANIMATION_DURATION = 250;

export function EndlessCanvas() {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<{
    pointerId: number;
    x: number;
    y: number;
  } | null>(null);
  const pointersRef = React.useRef(new Map<number, { x: number; y: number }>());
  // Touches that started on a node stay uncaptured until they move past
  // TAP_SLOP, so a plain tap still delivers its click to the node button.
  const pendingTapsRef = React.useRef(
    new Map<number, { x: number; y: number }>()
  );
  const pinchRef = React.useRef<{
    distance: number;
    scale: number;
    worldX: number;
    worldY: number;
  } | null>(null);
  const hasInitialFitRef = React.useRef(false);
  const viewportAnimationTimerRef = React.useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);
  const animationStartedAtRef = React.useRef(0);
  const animationTimersRef = React.useRef(
    new Set<ReturnType<typeof setTimeout>>()
  );
  const [scale, setScale] = React.useState(0.8);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [isCanvasReady, setIsCanvasReady] = React.useState(false);
  const [isViewportAnimating, setIsViewportAnimating] = React.useState(false);
  const [selectedNodeId, setSelectedNodeId] = React.useState("fedor");
  const [openDocumentIds, setOpenDocumentIds] = React.useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = React.useState(
    () => new Set<string>()
  );
  const [hiddenNodeIds, setHiddenNodeIds] = React.useState(
    () => new Set<string>()
  );
  const [concealedNodeIds, setConcealedNodeIds] = React.useState(
    () => new Set<string>()
  );

  const layout = React.useMemo(
    () => layoutVisibleNodes(expandedFolders, hiddenNodeIds),
    [expandedFolders, hiddenNodeIds]
  );
  const visibleNodes = layout.nodes;
  const visibleNodeById = React.useMemo(
    () => new Map(visibleNodes.map((node) => [node.id, node])),
    [visibleNodes]
  );
  const openDocuments = openDocumentIds.flatMap((documentId) => {
    const node = nodeById.get(documentId);
    return node?.kind === "document" ? [node] : [];
  });

  const fitCanvas = React.useCallback((animate = true) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    if (viewportAnimationTimerRef.current) {
      clearTimeout(viewportAnimationTimerRef.current);
    }
    setIsViewportAnimating(animate);
    if (animate) {
      viewportAnimationTimerRef.current = setTimeout(
        () => setIsViewportAnimating(false),
        VIEWPORT_ANIMATION_DURATION
      );
    }

    const availableWidth = viewport.clientWidth;
    const availableHeight = viewport.clientHeight;
    const fitScale = Math.min(
      0.9,
      (availableWidth - 80) / layout.width,
      (availableHeight - 80) / layout.height
    );
    const nextScale = Math.max(MIN_SCALE, fitScale);

    setScale(nextScale);
    setOffset({
      x: (availableWidth - layout.width * nextScale) / 2,
      y: (availableHeight - layout.height * nextScale) / 2,
    });
  }, [layout.height, layout.width]);

  React.useLayoutEffect(() => {
    if (hasInitialFitRef.current) return;
    hasInitialFitRef.current = true;
    fitCanvas(false);
    setIsCanvasReady(true);
  }, [fitCanvas]);

  React.useEffect(
    () => () => {
      for (const timer of animationTimersRef.current) clearTimeout(timer);
      if (viewportAnimationTimerRef.current) {
        clearTimeout(viewportAnimationTimerRef.current);
      }
    },
    []
  );

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const preventBrowserZoom = (event: Event) => event.preventDefault();
    viewport.addEventListener("gesturestart", preventBrowserZoom, {
      passive: false,
    });
    viewport.addEventListener("gesturechange", preventBrowserZoom, {
      passive: false,
    });
    viewport.addEventListener("touchmove", preventBrowserZoom, {
      passive: false,
    });
    viewport.addEventListener("wheel", preventBrowserZoom, {
      passive: false,
    });

    return () => {
      viewport.removeEventListener("gesturestart", preventBrowserZoom);
      viewport.removeEventListener("gesturechange", preventBrowserZoom);
      viewport.removeEventListener("touchmove", preventBrowserZoom);
      viewport.removeEventListener("wheel", preventBrowserZoom);
    };
  }, []);

  function goToCurrent() {
    const viewport = viewportRef.current;
    const node = visibleNodeById.get(selectedNodeId);
    if (!viewport || !node) return;

    if (viewportAnimationTimerRef.current) {
      clearTimeout(viewportAnimationTimerRef.current);
    }
    setIsViewportAnimating(true);
    viewportAnimationTimerRef.current = setTimeout(
      () => setIsViewportAnimating(false),
      VIEWPORT_ANIMATION_DURATION
    );

    setOffset({
      x: viewport.clientWidth / 2 - (node.x + node.width / 2) * scale,
      y: viewport.clientHeight / 2 - (node.y + NODE_HEIGHT / 2) * scale,
    });
  }

  function changeScale(nextScale: number) {
    const viewport = viewportRef.current;
    if (!viewport) return;

    setIsViewportAnimating(false);
    const clampedScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale));
    const centerX = viewport.clientWidth / 2;
    const centerY = viewport.clientHeight / 2;
    const worldCenterX = (centerX - offset.x) / scale;
    const worldCenterY = (centerY - offset.y) / scale;

    setScale(clampedScale);
    setOffset({
      x: centerX - worldCenterX * clampedScale,
      y: centerY - worldCenterY * clampedScale,
    });
  }

  function logAnimationEvent(message: string) {
    const elapsed = Math.round(
      performance.now() - animationStartedAtRef.current
    );
    console.info(`[tree-animation +${elapsed}ms] ${message}`);
  }

  function startAnimationLog(message: string) {
    animationStartedAtRef.current = performance.now();
    console.info(`[tree-animation +0ms] ${message}`);
  }

  function scheduleAnimation(delay: number, callback: () => void) {
    const timer = setTimeout(() => {
      callback();
      animationTimersRef.current.delete(timer);
    }, delay);
    animationTimersRef.current.add(timer);
  }

  function selectNode(nodeId: string) {
    const node = nodeById.get(nodeId);
    if (!node) return;

    setSelectedNodeId(nodeId);
    if (node.kind === "document") {
      setOpenDocumentIds((current) => [
        ...current.filter((documentId) => documentId !== nodeId),
        nodeId,
      ]);
      return;
    }

    if (animationTimersRef.current.size > 0) return;

    const nextExpandedFolders = new Set(expandedFolders);
    const isExpanding = !nextExpandedFolders.has(nodeId);
    if (isExpanding) nextExpandedFolders.add(nodeId);
    else nextExpandedFolders.delete(nodeId);

    const nextVisibleNodes = layoutVisibleNodes(nextExpandedFolders).nodes;
    const currentNodeIds = new Set(
      visibleNodes.map((visibleNode) => visibleNode.id)
    );
    const nextNodeIds = new Set(
      nextVisibleNodes.map((visibleNode) => visibleNode.id)
    );
    const rowDuration = ROW_TRAVEL_DURATION;

    if (isExpanding) {
      const addedNodeIds = nextVisibleNodes
        .filter((visibleNode) => !currentNodeIds.has(visibleNode.id))
        .map((visibleNode) => visibleNode.id);
      const initiallyHiddenNodeIds = addedNodeIds.slice(2);
      const firstReservedNodeId = addedNodeIds[1];

      startAnimationLog(
        `open ${nodeId}: show ${addedNodeIds[0] ?? "none"}; start sibling movement`
      );
      setHiddenNodeIds(
        (current) => new Set([...current, ...initiallyHiddenNodeIds])
      );
      if (firstReservedNodeId) {
        setConcealedNodeIds(
          (current) => new Set([...current, firstReservedNodeId])
        );
      }
      setExpandedFolders(nextExpandedFolders);

      addedNodeIds.slice(1).forEach((addedNodeId, index) => {
        scheduleAnimation((index + 1) * rowDuration, () => {
          const nextReservedNodeId = addedNodeIds[index + 2];
          setHiddenNodeIds((current) => {
            const next = new Set(current);
            if (nextReservedNodeId) next.delete(nextReservedNodeId);
            return next;
          });
          setConcealedNodeIds((current) => {
            const next = new Set(current);
            next.delete(addedNodeId);
            if (nextReservedNodeId) next.add(nextReservedNodeId);
            return next;
          });
          logAnimationEvent(
            `show ${addedNodeId}${nextReservedNodeId ? "; move siblings one row" : ""}`
          );
        });
      });
      return;
    }

    const removedNodeIds = visibleNodes
      .filter((visibleNode) => !nextNodeIds.has(visibleNode.id))
      .map((visibleNode) => visibleNode.id)
      .reverse();

    startAnimationLog(`close ${nodeId}: hide nodes one row at a time`);
    removedNodeIds.forEach((removedNodeId, index) => {
      scheduleAnimation(index * rowDuration, () => {
        setHiddenNodeIds((current) => new Set([...current, removedNodeId]));
        logAnimationEvent(`hide ${removedNodeId}; move siblings one row`);
      });
    });
    scheduleAnimation(removedNodeIds.length * rowDuration, () => {
      setExpandedFolders(nextExpandedFolders);
      setHiddenNodeIds((current) => {
        const next = new Set(current);
        for (const removedNodeId of removedNodeIds) next.delete(removedNodeId);
        return next;
      });
      logAnimationEvent(`close ${nodeId} complete`);
    });
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    setIsViewportAnimating(false);
    const target = event.target as HTMLElement;
    const nodeTarget = target.closest("[data-node]");
    const isControl = target.closest("button") && !nodeTarget;
    if (
      target.closest("a, input, textarea") ||
      isControl ||
      (nodeTarget && event.pointerType !== "touch")
    ) {
      return;
    }

    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    if (nodeTarget) {
      pendingTapsRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
    } else {
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    if (pointersRef.current.size === 1) {
      dragRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
      return;
    }

    for (const pointerId of pendingTapsRef.current.keys()) {
      event.currentTarget.setPointerCapture(pointerId);
    }
    pendingTapsRef.current.clear();

    const [first, second] = [...pointersRef.current.values()];
    const centerX = (first.x + second.x) / 2;
    const centerY = (first.y + second.y) / 2;
    pinchRef.current = {
      distance: Math.hypot(second.x - first.x, second.y - first.y),
      scale,
      worldX: (centerX - offset.x) / scale,
      worldY: (centerY - offset.y) / scale,
    };
    dragRef.current = null;
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!pointersRef.current.has(event.pointerId)) return;

    const tapStart = pendingTapsRef.current.get(event.pointerId);
    if (
      tapStart &&
      Math.hypot(event.clientX - tapStart.x, event.clientY - tapStart.y) >
        TAP_SLOP
    ) {
      pendingTapsRef.current.delete(event.pointerId);
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    const pinch = pinchRef.current;
    if (pointersRef.current.size >= 2 && pinch) {
      const [first, second] = [...pointersRef.current.values()];
      const centerX = (first.x + second.x) / 2;
      const centerY = (first.y + second.y) / 2;
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      const nextScale = Math.min(
        MAX_SCALE,
        Math.max(
          MIN_SCALE,
          pinch.scale * (distance / Math.max(pinch.distance, 1))
        )
      );

      setScale(nextScale);
      setOffset({
        x: centerX - pinch.worldX * nextScale,
        y: centerY - pinch.worldY * nextScale,
      });
      return;
    }

    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.x;
    const deltaY = event.clientY - drag.y;
    dragRef.current = { ...drag, x: event.clientX, y: event.clientY };
    setOffset((current) => ({
      x: current.x + deltaX,
      y: current.y + deltaY,
    }));
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    if (!pointersRef.current.has(event.pointerId)) return;

    pointersRef.current.delete(event.pointerId);
    pendingTapsRef.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    pinchRef.current = null;
    const remainingPointer = [...pointersRef.current.entries()][0];
    dragRef.current = remainingPointer
      ? {
          pointerId: remainingPointer[0],
          x: remainingPointer[1].x,
          y: remainingPointer[1].y,
        }
      : null;
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    setIsViewportAnimating(false);
    if (!event.ctrlKey && !event.metaKey) {
      setOffset((current) => ({
        x: current.x - event.deltaX,
        y: current.y - event.deltaY,
      }));
      return;
    }

    changeScale(scale * (event.deltaY > 0 ? 0.9 : 1.1));
  }

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-[#f1f1ee] text-[#171717] dark:bg-[#151515] dark:text-[#e8e8e3]">
      <div
        ref={viewportRef}
        className="relative flex-1 cursor-grab touch-none overflow-hidden overscroll-none active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onWheel={handleWheel}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,#cacbc6_1px,transparent_1px)] transition-opacity dark:bg-[radial-gradient(circle,#30312e_1px,transparent_1px)]"
          style={{
            backgroundPosition: `${offset.x}px ${offset.y}px`,
            backgroundSize: `${20 * scale}px ${20 * scale}px`,
            opacity: isCanvasReady
              ? Math.min(1, Math.max(0.05, scale))
              : 0,
          }}
          aria-hidden="true"
        />

        <div
          className="absolute left-0 top-0 origin-top-left opacity-0 data-[ready=true]:opacity-100 data-[animate=true]:transition-transform data-[animate=true]:duration-[250ms] data-[animate=true]:ease-out motion-reduce:transition-none"
          data-ready={isCanvasReady ? "true" : undefined}
          data-animate={isViewportAnimating ? "true" : undefined}
          style={{
            width: layout.width,
            height: layout.height,
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          }}
        >
          <div className="absolute inset-0" aria-hidden="true">
            {visibleNodes.map((parent) => {
              const children = visibleNodes.filter(
                (node) => node.parentId === parent.id
              );
              if (children.length === 0) return null;

              const parentX = parent.x + parent.width;
              const childX = children[0].x;
              const parentY = parent.y + NODE_HEIGHT / 2;
              const childYs = children.map(
                (child) => child.y + NODE_HEIGHT / 2
              );
              const middleX = parentX + (childX - parentX) / 2;

              return (
                <React.Fragment key={parent.id}>
                  <span
                    className="absolute border-t border-dashed border-[#a9aaa5] transition-[top,left,width] ease-linear motion-reduce:transition-none dark:border-[#50514d]"
                    style={{
                      left: parentX,
                      top: parentY,
                      width: middleX - parentX,
                      transitionDuration: `${ROW_TRAVEL_DURATION}ms`,
                    }}
                  />
                  {children.map((child, index) => {
                    const childY = childYs[index] ?? parentY;
                    const previousY = childYs[index - 1] ?? parentY;
                    const isConcealed = concealedNodeIds.has(child.id);

                    return (
                      <React.Fragment key={child.id}>
                        {index > 0 ? (
                          <span
                            className="absolute border-l border-dashed border-[#a9aaa5] data-[concealed=true]:opacity-0 dark:border-[#50514d]"
                            data-concealed={isConcealed ? "true" : undefined}
                            style={{
                              left: middleX,
                              top: Math.min(previousY, childY),
                              height: Math.abs(childY - previousY),
                            }}
                          />
                        ) : null}
                        <span
                          className="absolute border-t border-dashed border-[#a9aaa5] transition-[top,left,width] ease-linear data-[concealed=true]:opacity-0 motion-reduce:transition-none dark:border-[#50514d]"
                          data-concealed={isConcealed ? "true" : undefined}
                          style={{
                            left: middleX,
                            top: childY,
                            width: childX - middleX,
                            transitionDuration: `${ROW_TRAVEL_DURATION}ms`,
                          }}
                        />
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>

          {visibleNodes.map((node) => {
            const isFolder = node.kind === "folder";
            const isExpanded = expandedFolders.has(node.id);

            return (
              <button
                key={node.id}
                type="button"
                data-node="true"
                data-kind={node.kind}
                data-selected={selectedNodeId === node.id ? "true" : undefined}
                data-concealed={
                  concealedNodeIds.has(node.id) ? "true" : undefined
                }
                className="group absolute left-0 top-0 min-h-28 cursor-pointer border border-[#aaa9a4] bg-[#f1f1ee] p-4 text-left shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-transform ease-linear will-change-transform hover:border-[#777773] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#ff6846] data-[concealed=true]:pointer-events-none data-[selected=true]:border-[#ff6846] data-[selected=true]:hover:border-[#ff6846] data-[concealed=true]:opacity-0 data-[selected=true]:shadow-[0_0_28px_rgba(255,104,70,0.16)] motion-reduce:transition-none dark:border-[#484946] dark:bg-[#1b1c1a] dark:shadow-[0_12px_32px_rgba(0,0,0,0.32)] dark:hover:border-[#72736e]"
                style={{
                  width: node.width,
                  transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
                  transitionDuration: `${ROW_TRAVEL_DURATION}ms`,
                }}
                onClick={() => selectNode(node.id)}
                onTransitionRun={(event) => {
                  if (
                    event.propertyName === "transform" &&
                    animationTimersRef.current.size > 0
                  ) {
                    logAnimationEvent(`reflow start ${node.id}`);
                  }
                }}
                onTransitionEnd={(event) => {
                  if (
                    event.propertyName === "transform" &&
                    animationTimersRef.current.size > 0
                  ) {
                    logAnimationEvent(`reflow end ${node.id}`);
                  }
                }}
              >
                {isFolder ? (
                  <FolderIcon className="pointer-events-none absolute right-3 top-3 size-4 opacity-50" />
                ) : (
                  <FileTextIcon className="pointer-events-none absolute right-3 top-3 size-4 opacity-50" />
                )}
                <span className="flex justify-between gap-4 opacity-50">
                  <span>{node.parentId ?? "~"}</span>
                </span>
                <strong className="mt-4 block font-normal">{node.name}</strong>
                <span className="mt-2 flex justify-between gap-4 opacity-60">
                  <span>{node.summary}</span>
                  {isFolder ? (
                    <span>{isExpanded ? "OPEN" : "CLOSED"}</span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>

        <div className="absolute bottom-4 left-4 flex border border-[#aaa9a4] bg-[#f1f1ee] dark:border-[#484946] dark:bg-[#1b1c1a]">
          <button
            type="button"
            className="size-7 border-r border-[#aaa9a4] hover:bg-black/5 dark:border-[#484946] dark:hover:bg-white/5"
            onClick={() => changeScale(scale - 0.1)}
            aria-label="Zoom out"
          >
            -
          </button>
          <span className="flex h-7 items-center border-r border-[#aaa9a4] px-2 dark:border-[#484946]">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            className="size-7 border-r border-[#aaa9a4] hover:bg-black/5 dark:border-[#484946] dark:hover:bg-white/5"
            onClick={() => changeScale(scale + 0.1)}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            className="grid size-7 place-items-center border-r border-[#aaa9a4] hover:bg-black/5 dark:border-[#484946] dark:hover:bg-white/5"
            onClick={() => fitCanvas(true)}
            aria-label="Fit canvas"
            title="Fit canvas"
          >
            <EnterFullScreenIcon className="size-4" />
          </button>
          <button
            type="button"
            className="grid size-7 place-items-center border-r border-[#aaa9a4] hover:bg-black/5 dark:border-[#484946] dark:hover:bg-white/5"
            onClick={goToCurrent}
            aria-label="Go to current folder"
            title="Go to current folder"
          >
            <TargetIcon className="size-4" />
          </button>
          <span className="grid size-7 place-items-center">
            <ThemeToggle />
          </span>
        </div>
      </div>

      <DocumentModals
        documents={openDocuments}
        onActivate={setSelectedNodeId}
        onClose={(documentId) =>
          setOpenDocumentIds((current) =>
            current.filter((openId) => openId !== documentId)
          )
        }
      />
    </div>
  );
}
