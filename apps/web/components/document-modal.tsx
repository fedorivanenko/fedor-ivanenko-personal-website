"use client";

import * as React from "react";

import { type DocumentNode, nodeById } from "@/content/filesystem";

const WINDOW_WIDTH = 480;
const WINDOW_MARGIN = 16;
const VISIBLE_HEADER_HEIGHT = 80;

interface DocumentModalsProps {
  documents: DocumentNode[];
  onClose: (documentId: string) => void;
}

interface WindowPosition {
  x: number;
  y: number;
  z: number;
}

interface DocumentWindowProps {
  document: DocumentNode;
  onClose: () => void;
  mobile?: boolean;
  position?: WindowPosition;
  selected?: boolean;
  onSelect?: () => void;
  onDragStart?: (event: React.PointerEvent<HTMLElement>) => void;
  onDrag?: (event: React.PointerEvent<HTMLElement>) => void;
  onDragEnd?: (event: React.PointerEvent<HTMLElement>) => void;
}

function getDocumentPath(document: DocumentNode): string {
  const names = [document.name];
  let parentId: string | undefined = document.parentId;

  while (parentId) {
    const parent = nodeById.get(parentId);
    if (!parent) break;
    names.unshift(parent.name);
    parentId = parent.parentId;
  }

  return `~/${names.join("")}`;
}

function getInitialPosition(index: number, z: number): WindowPosition {
  const step = (index % 7) * 28;
  const maxX = Math.max(WINDOW_MARGIN, window.innerWidth - WINDOW_WIDTH - WINDOW_MARGIN);

  return {
    x: Math.min(maxX, Math.max(WINDOW_MARGIN, (window.innerWidth - WINDOW_WIDTH) / 2 + step)),
    y: Math.min(window.innerHeight - VISIBLE_HEADER_HEIGHT, 48 + step),
    z,
  };
}

function DocumentWindow({
  document,
  onClose,
  mobile,
  position,
  selected,
  onSelect,
  onDragStart,
  onDrag,
  onDragEnd,
}: DocumentWindowProps) {
  const titleId = React.useId();

  return (
    <article
      className={
        mobile
          ? "flex h-full w-full flex-col border border-[#aaa9a4] bg-[#f1f1ee] text-[#171717] dark:border-[#484946] dark:bg-[#1b1c1a] dark:text-[#e8e8e3]"
          : "pointer-events-auto absolute flex max-h-[min(42rem,calc(100svh-2rem))] min-h-72 w-[30rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden border border-[#aaa9a4] bg-[#f1f1ee] text-[#171717] shadow-[0_20px_60px_rgba(0,0,0,0.32)] data-[selected=true]:border-[#ff6846] dark:border-[#484946] dark:bg-[#1b1c1a] dark:text-[#e8e8e3]"
      }
      style={
        position
          ? { left: position.x, top: position.y, zIndex: position.z }
          : undefined
      }
      data-selected={selected ? "true" : undefined}
      role="dialog"
      aria-modal={mobile ? true : undefined}
      aria-labelledby={titleId}
      onPointerDown={onSelect}
    >
      <header
        className="flex touch-none select-none items-start justify-between gap-6 border-b border-[#aaa9a4] p-5 md:cursor-move dark:border-[#484946]"
        onPointerDown={onDragStart}
        onPointerMove={onDrag}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragEnd}
      >
        <div className="min-w-0">
          <p className="truncate opacity-50">{getDocumentPath(document)}</p>
          <h2 id={titleId} className="mt-3">
            {document.name}
          </h2>
        </div>
        <button
          type="button"
          className="shrink-0 cursor-pointer hover:underline focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#ff6846]"
          onClick={onClose}
        >
          Close
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-5">
        <p className="opacity-50">{document.summary}</p>
        <p className="mt-8 leading-[1.6]">{document.content}</p>
      </div>

      <footer className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 border-t border-[#aaa9a4] p-5 dark:border-[#484946]">
        <span className="opacity-50">TYPE</span>
        <span>document</span>
        <span className="opacity-50">PARENT</span>
        <span>{document.parentId}/</span>
      </footer>
    </article>
  );
}

export function DocumentModals({ documents, onClose }: DocumentModalsProps) {
  const currentDocument = documents.at(-1);
  const documentIds = documents.map((document) => document.id).join(",");
  const zIndexRef = React.useRef(0);
  const dragRef = React.useRef<{
    documentId: string;
    pointerId: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [positions, setPositions] = React.useState<Record<string, WindowPosition>>(
    {},
  );
  const [selectedDocumentId, setSelectedDocumentId] = React.useState<string>();

  const bringToFront = React.useCallback((documentId: string) => {
    const nextZ = ++zIndexRef.current;
    setSelectedDocumentId(documentId);
    setPositions((current) => ({
      ...current,
      [documentId]: current[documentId]
        ? { ...current[documentId], z: nextZ }
        : getInitialPosition(Object.keys(current).length, nextZ),
    }));
  }, []);

  React.useLayoutEffect(() => {
    const ids = documentIds ? documentIds.split(",") : [];
    setPositions((current) => {
      const next: Record<string, WindowPosition> = {};
      ids.forEach((documentId, index) => {
        next[documentId] =
          current[documentId] ?? getInitialPosition(index, ++zIndexRef.current);
      });
      return next;
    });

    const nextCurrentId = ids.at(-1);
    if (nextCurrentId) bringToFront(nextCurrentId);
    else setSelectedDocumentId(undefined);
  }, [bringToFront, documentIds]);

  React.useEffect(() => {
    if (!currentDocument) return;

    const closeCurrent = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onClose(selectedDocumentId ?? currentDocument.id);
    };

    window.addEventListener("keydown", closeCurrent);
    return () => window.removeEventListener("keydown", closeCurrent);
  }, [currentDocument, onClose, selectedDocumentId]);

  React.useEffect(() => {
    const keepWindowsVisible = () => {
      setPositions((current) =>
        Object.fromEntries(
          Object.entries(current).map(([documentId, position]) => [
            documentId,
            {
              ...position,
              x: Math.min(
                Math.max(WINDOW_MARGIN, window.innerWidth - WINDOW_WIDTH - WINDOW_MARGIN),
                Math.max(WINDOW_MARGIN, position.x),
              ),
              y: Math.min(
                window.innerHeight - VISIBLE_HEADER_HEIGHT,
                Math.max(0, position.y),
              ),
            },
          ]),
        ),
      );
    };

    window.addEventListener("resize", keepWindowsVisible);
    return () => window.removeEventListener("resize", keepWindowsVisible);
  }, []);

  function startDrag(
    event: React.PointerEvent<HTMLElement>,
    documentId: string,
  ) {
    if ((event.target as HTMLElement).closest("button")) return;

    event.stopPropagation();
    const position = positions[documentId];
    if (!position) return;

    bringToFront(documentId);
    dragRef.current = {
      documentId,
      pointerId: event.pointerId,
      offsetX: event.clientX - position.x,
      offsetY: event.clientY - position.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function dragWindow(event: React.PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const maxX = Math.max(WINDOW_MARGIN, window.innerWidth - WINDOW_WIDTH - WINDOW_MARGIN);
    const x = Math.min(maxX, Math.max(WINDOW_MARGIN, event.clientX - drag.offsetX));
    const y = Math.min(
      window.innerHeight - VISIBLE_HEADER_HEIGHT,
      Math.max(0, event.clientY - drag.offsetY),
    );

    setPositions((current) => ({
      ...current,
      [drag.documentId]: { ...current[drag.documentId], x, y },
    }));
  }

  function endDrag(event: React.PointerEvent<HTMLElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  if (!currentDocument) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 p-4 md:hidden">
        <DocumentWindow
          key={currentDocument.id}
          document={currentDocument}
          onClose={() => onClose(currentDocument.id)}
          mobile
        />
      </div>

      <div className="pointer-events-none fixed inset-0 z-40 hidden md:block">
        {documents.map((document) => (
          <DocumentWindow
            key={document.id}
            document={document}
            position={positions[document.id]}
            selected={selectedDocumentId === document.id}
            onSelect={() => bringToFront(document.id)}
            onClose={() => onClose(document.id)}
            onDragStart={(event) => startDrag(event, document.id)}
            onDrag={dragWindow}
            onDragEnd={endDrag}
          />
        ))}
      </div>
    </>
  );
}
