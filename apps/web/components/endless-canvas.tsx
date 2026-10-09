"use client";

import { EnterFullScreenIcon, TargetIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { DocumentModals } from "@/components/document-modal";
import ThemeToggle from "@/components/theme-toggle";

import {
  layoutVisibleNodes,
  NODE_HEIGHT,
  nodeById,
} from "@/content/filesystem";

const MIN_SCALE = 0.35;
const MAX_SCALE = 1.6;

const DEFAULT_ANIMATION_SETTINGS = {
  rowDuration: 500,
};

export function EndlessCanvas() {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<{
    pointerId: number;
    x: number;
    y: number;
  } | null>(null);
  const pointersRef = React.useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = React.useRef<{
    distance: number;
    scale: number;
    worldX: number;
    worldY: number;
  } | null>(null);
  const hasInitialFitRef = React.useRef(false);
  const animationStartedAtRef = React.useRef(0);
  const animationTimersRef = React.useRef(
    new Set<ReturnType<typeof setTimeout>>(),
  );
  const [scale, setScale] = React.useState(0.8);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = React.useState("fedor");
  const [openDocumentIds, setOpenDocumentIds] = React.useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = React.useState(
    () => new Set(["fedor", "work", "capabilities", "experiments"]),
  );
  const [animationSettings, setAnimationSettings] = React.useState(
    DEFAULT_ANIMATION_SETTINGS,
  );
  const [animationDebug, setAnimationDebug] = React.useState({
    direction: "open" as "open" | "close",
    nodeCount: 3,
    step: 0,
    complete: true,
  });
  const [hiddenNodeIds, setHiddenNodeIds] = React.useState(
    () => new Set<string>(),
  );
  const [concealedNodeIds, setConcealedNodeIds] = React.useState(
    () => new Set<string>(),
  );

  const layout = React.useMemo(
    () => layoutVisibleNodes(expandedFolders, hiddenNodeIds),
    [expandedFolders, hiddenNodeIds],
  );
  const visibleNodes = layout.nodes;
  const visibleNodeById = React.useMemo(
    () => new Map(visibleNodes.map((node) => [node.id, node])),
    [visibleNodes],
  );
  const openDocuments = openDocumentIds.flatMap((documentId) => {
    const node = nodeById.get(documentId);
    return node?.kind === "document" ? [node] : [];
  });

  const fitCanvas = React.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const availableWidth = viewport.clientWidth;
    const availableHeight = viewport.clientHeight;
    const fitScale = Math.min(
      0.9,
      (availableWidth - 80) / layout.width,
      (availableHeight - 80) / layout.height,
    );
    const nextScale = Math.max(0.45, fitScale);

    setScale(nextScale);
    setOffset({
      x: (availableWidth - layout.width * nextScale) / 2,
      y: (availableHeight - layout.height * nextScale) / 2,
    });
  }, [layout.height, layout.width]);

  React.useLayoutEffect(() => {
    if (hasInitialFitRef.current) return;
    hasInitialFitRef.current = true;
    fitCanvas();
  }, [fitCanvas]);

  React.useEffect(
    () => () => {
      for (const timer of animationTimersRef.current) clearTimeout(timer);
    },
    [],
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

    setOffset({
      x: viewport.clientWidth / 2 - (node.x + node.width / 2) * scale,
      y: viewport.clientHeight / 2 - (node.y + NODE_HEIGHT / 2) * scale,
    });
  }

  function changeScale(nextScale: number) {
    const viewport = viewportRef.current;
    if (!viewport) return;

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
    const elapsed = Math.round(performance.now() - animationStartedAtRef.current);
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
      visibleNodes.map((visibleNode) => visibleNode.id),
    );
    const nextNodeIds = new Set(
      nextVisibleNodes.map((visibleNode) => visibleNode.id),
    );
    const rowDuration = animationSettings.rowDuration;

    if (isExpanding) {
      const addedNodeIds = nextVisibleNodes
        .filter((visibleNode) => !currentNodeIds.has(visibleNode.id))
        .map((visibleNode) => visibleNode.id);
      const initiallyHiddenNodeIds = addedNodeIds.slice(2);
      const firstReservedNodeId = addedNodeIds[1];

      setAnimationDebug({
        direction: "open",
        nodeCount: addedNodeIds.length,
        step: 0,
        complete: addedNodeIds.length <= 1,
      });
      startAnimationLog(
        `open ${nodeId}: show ${addedNodeIds[0] ?? "none"}; start sibling movement`,
      );
      setHiddenNodeIds(
        (current) => new Set([...current, ...initiallyHiddenNodeIds]),
      );
      if (firstReservedNodeId) {
        setConcealedNodeIds((current) =>
          new Set([...current, firstReservedNodeId]),
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
          setAnimationDebug((current) => ({
            ...current,
            step: index + 1,
            complete: index + 2 === addedNodeIds.length,
          }));
          logAnimationEvent(
            `show ${addedNodeId}${nextReservedNodeId ? "; move siblings one row" : ""}`,
          );
        });
      });
      return;
    }

    const removedNodeIds = visibleNodes
      .filter((visibleNode) => !nextNodeIds.has(visibleNode.id))
      .map((visibleNode) => visibleNode.id)
      .reverse();

    setAnimationDebug({
      direction: "close",
      nodeCount: removedNodeIds.length,
      step: 0,
      complete: false,
    });
    startAnimationLog(`close ${nodeId}: hide nodes one row at a time`);
    removedNodeIds.forEach((removedNodeId, index) => {
      scheduleAnimation(index * rowDuration, () => {
        setHiddenNodeIds((current) => new Set([...current, removedNodeId]));
        setAnimationDebug((current) => ({ ...current, step: index }));
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
      setAnimationDebug((current) => ({ ...current, complete: true }));
      logAnimationEvent(`close ${nodeId} complete`);
    });
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
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
    event.currentTarget.setPointerCapture(event.pointerId);

    if (pointersRef.current.size === 1) {
      dragRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
      return;
    }

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
          pinch.scale * (distance / Math.max(pinch.distance, 1)),
        ),
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
        className="relative flex-1 touch-none cursor-grab overflow-hidden overscroll-none bg-[radial-gradient(circle,#cacbc6_1px,transparent_1px)] [background-size:20px_20px] active:cursor-grabbing dark:bg-[radial-gradient(circle,#30312e_1px,transparent_1px)]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onWheel={handleWheel}
      >
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{
            width: layout.width,
            height: layout.height,
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          }}
        >
          <div className="absolute inset-0" aria-hidden="true">
            {visibleNodes.map((parent) => {
              const children = visibleNodes.filter(
                (node) => node.parentId === parent.id,
              );
              if (children.length === 0) return null;

              const parentX = parent.x + parent.width;
              const childX = children[0].x;
              const parentY = parent.y + NODE_HEIGHT / 2;
              const childYs = children.map(
                (child) => child.y + NODE_HEIGHT / 2,
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
                      transitionDuration: `${animationSettings.rowDuration}ms`,
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
                            transitionDuration: `${animationSettings.rowDuration}ms`,
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
                className="absolute top-0 left-0 min-h-28 cursor-pointer border transition-transform ease-linear will-change-transform data-[concealed=true]:pointer-events-none data-[concealed=true]:opacity-0 motion-reduce:transition-none border-[#aaa9a4] bg-[#f1f1ee] p-4 text-left shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-[#777773] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#ff6846] data-[selected=true]:border-[#ff6846] data-[selected=true]:shadow-[0_0_28px_rgba(255,104,70,0.16)] dark:border-[#484946] dark:bg-[#1b1c1a] dark:shadow-[0_12px_32px_rgba(0,0,0,0.32)] dark:hover:border-[#72736e]"
                style={{
                  width: node.width,
                  transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
                  transitionDuration: `${animationSettings.rowDuration}ms`,
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
                <span className="flex justify-between gap-4 opacity-50">
                  <span>{node.parentId ?? "~"}</span>
                  <span>{node.kind.toUpperCase()}</span>
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
            onClick={fitCanvas}
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

        <details
          className="absolute top-4 right-4 w-fit max-w-[calc(100%-2rem)] open:w-72 border border-[#aaa9a4] bg-[#f1f1ee] dark:border-[#484946] dark:bg-[#1b1c1a]"
          onPointerDown={(event) => event.stopPropagation()}
          onWheel={(event) => event.stopPropagation()}
        >
          <summary className="cursor-pointer list-none px-3 py-2 hover:bg-black/5 [&::-webkit-details-marker]:hidden dark:hover:bg-white/5">
            Animation debug
          </summary>
          <div className="space-y-3 border-t border-[#aaa9a4] p-3 dark:border-[#484946]">
            <label className="grid grid-cols-[1fr_6rem] items-center gap-3">
              <span>Row travel ms</span>
              <input
                className="min-w-0 border border-[#aaa9a4] bg-transparent px-2 py-1 dark:border-[#484946]"
                type="number"
                min={0}
                max={8000}
                step={50}
                value={animationSettings.rowDuration}
                onChange={(event) =>
                  setAnimationSettings({
                    rowDuration: Math.max(0, Number(event.target.value)),
                  })
                }
              />
            </label>
            <p className="opacity-50">
              Card 1 and sibling movement start together. Each next card waits
              for one row of travel.
            </p>
            <div className="border border-[#aaa9a4] dark:border-[#484946]">
              <div className="flex items-center justify-between border-b border-[#aaa9a4] px-2 py-1 dark:border-[#484946]">
                <span>{animationDebug.direction.toUpperCase()}</span>
                <span className="opacity-50">
                  {animationDebug.nodeCount} nodes
                </span>
              </div>
              <div
                className="grid h-8"
                style={{
                  gridTemplateColumns: `repeat(${Math.max(1, animationDebug.nodeCount)}, minmax(0, 1fr))`,
                }}
              >
                {Array.from(
                  { length: Math.max(1, animationDebug.nodeCount) },
                  (_, index) => `${animationDebug.direction}-${index + 1}`,
                ).map((eventId, index) => (
                    <span
                      key={eventId}
                      className="grid place-items-center border-r border-[#aaa9a4] last:border-r-0 data-[current=true]:bg-[#ff6846] data-[current=true]:text-black data-[passed=true]:bg-[#ff6846]/15 dark:border-[#484946]"
                      data-current={
                        !animationDebug.complete &&
                        animationDebug.step === index
                          ? "true"
                          : undefined
                      }
                      data-passed={
                        animationDebug.complete || animationDebug.step > index
                          ? "true"
                          : undefined
                      }
                    >
                      {animationDebug.direction === "open" ? "+" : "-"}
                      {index + 1}
                    </span>
                  ))}
              </div>
              <div className="flex justify-between border-t border-[#aaa9a4] px-2 py-1 opacity-50 dark:border-[#484946]">
                <span>0ms</span>
                <span>
                  {(animationDebug.direction === "open"
                    ? Math.max(0, animationDebug.nodeCount - 1)
                    : animationDebug.nodeCount) * animationSettings.rowDuration}
                  ms
                </span>
              </div>
            </div>
            <p className="opacity-50">Timing events log to the browser console.</p>
            <div className="flex items-center justify-end border-t border-[#aaa9a4] pt-3 dark:border-[#484946]">
              <button
                type="button"
                className="hover:underline"
                onClick={() =>
                  setAnimationSettings(DEFAULT_ANIMATION_SETTINGS)
                }
              >
                Reset
              </button>
            </div>
          </div>
        </details>
      </div>

      <DocumentModals
        documents={openDocuments}
        onClose={(documentId) =>
          setOpenDocumentIds((current) =>
            current.filter((openId) => openId !== documentId),
          )
        }
      />
    </div>
  );
}
