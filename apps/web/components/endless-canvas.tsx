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
const REFLOW_DURATION = 150;
const CASCADE_OVERLAP = REFLOW_DURATION * 0.5;
const REVEAL_DELAY = REFLOW_DURATION - CASCADE_OVERLAP;
const CASCADE_STEP = 20;

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
  const [enteringNodeIds, setEnteringNodeIds] = React.useState(
    () => new Set<string>(),
  );

  const layout = React.useMemo(
    () => layoutVisibleNodes(expandedFolders),
    [expandedFolders],
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

    if (isExpanding) {
      const addedNodeIds = nextVisibleNodes
        .filter((visibleNode) => !currentNodeIds.has(visibleNode.id))
        .map((visibleNode) => visibleNode.id);

      setEnteringNodeIds((current) => new Set([...current, ...addedNodeIds]));
      addedNodeIds.forEach((addedNodeId, index) => {
        scheduleAnimation(REVEAL_DELAY + index * CASCADE_STEP, () => {
          setEnteringNodeIds((current) => {
            const next = new Set(current);
            next.delete(addedNodeId);
            return next;
          });
        });
      });
      if (addedNodeIds.length > 0) {
        scheduleAnimation(
          REVEAL_DELAY +
            (addedNodeIds.length - 1) * CASCADE_STEP +
            REFLOW_DURATION,
          () => undefined,
        );
      }
      setExpandedFolders(nextExpandedFolders);
      return;
    }

    const removedNodeIds = visibleNodes
      .filter((visibleNode) => !nextNodeIds.has(visibleNode.id))
      .map((visibleNode) => visibleNode.id)
      .reverse();

    removedNodeIds.forEach((removedNodeId, index) => {
      scheduleAnimation(index * CASCADE_STEP, () => {
        setEnteringNodeIds((current) => new Set([...current, removedNodeId]));
      });
    });
    const collapseDelay =
      Math.max(0, removedNodeIds.length - 1) * CASCADE_STEP +
      REFLOW_DURATION -
      CASCADE_OVERLAP;
    scheduleAnimation(collapseDelay, () => {
      setExpandedFolders(nextExpandedFolders);
      setEnteringNodeIds((current) => {
        const next = new Set(current);
        for (const removedNodeId of removedNodeIds) next.delete(removedNodeId);
        return next;
      });
    });
    scheduleAnimation(collapseDelay + REFLOW_DURATION, () => undefined);
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
              const verticalTop = Math.min(parentY, ...childYs);
              const verticalBottom = Math.max(parentY, ...childYs);
              const isBranchEntering = children.every((child) =>
                enteringNodeIds.has(child.id),
              );

              return (
                <React.Fragment key={parent.id}>
                  <span
                    className="absolute border-t border-dashed border-[#a9aaa5] transition-[top,left,width,opacity] duration-150 ease-out data-[entering=true]:opacity-0 motion-reduce:transition-none dark:border-[#50514d]"
                    data-entering={isBranchEntering ? "true" : undefined}
                    style={{
                      left: parentX,
                      top: parentY,
                      width: middleX - parentX,
                    }}
                  />
                  <span
                    className="absolute border-l border-dashed border-[#a9aaa5] transition-[top,left,height,opacity] duration-150 ease-out data-[entering=true]:opacity-0 motion-reduce:transition-none dark:border-[#50514d]"
                    data-entering={isBranchEntering ? "true" : undefined}
                    style={{
                      left: middleX,
                      top: verticalTop,
                      height: verticalBottom - verticalTop,
                    }}
                  />
                  {children.map((child, index) => (
                    <span
                      key={child.id}
                      className="absolute border-t border-dashed border-[#a9aaa5] transition-[top,left,width,opacity] duration-150 ease-out data-[entering=true]:opacity-0 motion-reduce:transition-none dark:border-[#50514d]"
                      data-entering={
                        enteringNodeIds.has(child.id) ? "true" : undefined
                      }
                      style={{
                        left: middleX,
                        top: childYs[index],
                        width: childX - middleX,
                      }}
                    />
                  ))}
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
                data-entering={
                  enteringNodeIds.has(node.id) ? "true" : undefined
                }
                className="absolute top-0 left-0 min-h-28 cursor-pointer border transition-[transform,opacity] duration-150 ease-out will-change-transform data-[entering=true]:pointer-events-none data-[entering=true]:opacity-0 motion-reduce:transition-none border-[#aaa9a4] bg-[#f1f1ee] p-4 text-left shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-[#777773] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#ff6846] data-[selected=true]:border-[#ff6846] data-[selected=true]:shadow-[0_0_28px_rgba(255,104,70,0.16)] dark:border-[#484946] dark:bg-[#1b1c1a] dark:shadow-[0_12px_32px_rgba(0,0,0,0.32)] dark:hover:border-[#72736e]"
                style={{
                  width: node.width,
                  transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
                }}
                onClick={() => selectNode(node.id)}
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
