export const GRID_SIZE = 20;
export const NODE_WIDTH = GRID_SIZE * 14;
export const NODE_HEIGHT = GRID_SIZE * 6;

const COLUMN_GAP = GRID_SIZE * 6;
const ROW_GAP = GRID_SIZE;
const WORLD_PADDING = GRID_SIZE * 3;

interface BaseNode {
  id: string;
  parentId?: string;
  name: string;
  summary: string;
}

export interface FolderNode extends BaseNode {
  kind: "folder";
}

export interface DocumentNode extends BaseNode {
  kind: "document";
  parentId: string;
  content: string;
  links?: { href: string; label: string }[];
}

export type FileSystemNode = FolderNode | DocumentNode;

export type PositionedNode = FileSystemNode & {
  x: number;
  y: number;
  width: number;
};

export const nodes: FileSystemNode[] = [
  {
    kind: "folder",
    id: "fedor",
    name: "fedor/",
    summary: "4 items",
  },
  {
    kind: "document",
    id: "about",
    parentId: "fedor",
    name: "about.md",
    summary: "profile and approach",
    content: `I'm Fedor Ivanenko, an independent AI engineer. I design and build AI-native tools with complex UI/UX from early concepts to production.

I also like to build websites and any cool UI you might need.`,
  },
  {
    kind: "folder",
    id: "capabilities",
    parentId: "fedor",
    name: "capabilities/",
    summary: "3 documents",
  },
  {
    kind: "folder",
    id: "work",
    parentId: "fedor",
    name: "work/",
    summary: "2 documents",
  },
  {
    kind: "document",
    id: "contact",
    parentId: "fedor",
    name: "contact.md",
    summary: "start a conversation",
    content: "Available for selected product design and engineering engagements.",
    links: [
      { href: "mailto:f@fedor.studio", label: "f@fedor.studio" },
      {
        href: "https://x.com/fedorivanenko_",
        label: "https://x.com/fedorivanenko_",
      },
      {
        href: "https://www.linkedin.com/in/fedorivanenko",
        label: "https://www.linkedin.com/in/fedorivanenko",
      },
    ],
  },
  {
    kind: "document",
    id: "geo-ops",
    parentId: "work",
    name: "geo-ops.md",
    summary: "AI Product Engineer",
    content: `GEO Ops
AI Product Engineer

I'm working as a founding engineer at a generative engine optimization agency, building an AI agent that works across the entire company workflow.`,
  },
  {
    kind: "document",
    id: "nazare",
    parentId: "work",
    name: "nazare.md",
    summary: "Founder & Engineer",
    content: `Nazare
Founder & Engineer

Nazare is an AI agent harness that makes decisions you can trust.

Nazare prevents LLMs from committing to decisions that are under-researched or based entirely on assumptions by actively challenging them and searching for evidence from reality.`,
    links: [
      {
        href: "https://nazare.engineering",
        label: "https://nazare.engineering",
      },
    ],
  },
  {
    kind: "document",
    id: "ai-systems",
    parentId: "capabilities",
    name: "ai-systems.md",
    summary: "LLMs and agents",
    content: `AI Engineering

I'm building AI agents and AI-native products.`,
  },
  {
    kind: "document",
    id: "product-design",
    parentId: "capabilities",
    name: "product-design.md",
    summary: "UI/UX design",
    content: `Design Engineering

I design and build complex UI/UX and websites.`,
  },
  {
    kind: "document",
    id: "engineering",
    parentId: "capabilities",
    name: "engineering.md",
    summary: "frontend and backend",
    content: `Full-Stack Engineering

I build web applications and websites. My preferred stack is Next.js, TanStack, and TypeScript.`,
  },
];

export const nodeById = new Map(nodes.map((node) => [node.id, node]));

const childrenByParentId = new Map<string, FileSystemNode[]>();
for (const node of nodes) {
  if (!node.parentId) continue;
  const children = childrenByParentId.get(node.parentId) ?? [];
  children.push(node);
  childrenByParentId.set(node.parentId, children);
}

export function layoutVisibleNodes(
  expandedFolders: Set<string>,
  hiddenNodeIds: Set<string> = new Set(),
): {
  nodes: PositionedNode[];
  width: number;
  height: number;
} {
  const positions = new Map<string, PositionedNode>();
  let lastRowY = WORLD_PADDING;
  let maximumVisibleDepth = 0;

  function placeNode(node: FileSystemNode, depth: number, y: number) {
    maximumVisibleDepth = Math.max(maximumVisibleDepth, depth);
    positions.set(node.id, {
      ...node,
      x: WORLD_PADDING + depth * (NODE_WIDTH + COLUMN_GAP),
      y,
      width: NODE_WIDTH,
    });

    const children =
      node.kind === "folder" && expandedFolders.has(node.id)
        ? (childrenByParentId.get(node.id) ?? []).filter(
            (child) => !hiddenNodeIds.has(child.id),
          )
        : [];
    children.forEach((child, index) => {
      if (index > 0) lastRowY += NODE_HEIGHT + ROW_GAP;
      placeNode(child, depth + 1, index === 0 ? y : lastRowY);
    });
  }

  const roots = nodes.filter(
    (node) => !node.parentId && !hiddenNodeIds.has(node.id),
  );
  roots.forEach((root, index) => {
    if (index > 0) lastRowY += NODE_HEIGHT + ROW_GAP;
    placeNode(root, 0, lastRowY);
  });

  return {
    nodes: nodes.flatMap((node) => {
      const positionedNode = positions.get(node.id);
      return positionedNode ? [positionedNode] : [];
    }),
    width:
      WORLD_PADDING * 2 +
      (maximumVisibleDepth + 1) * NODE_WIDTH +
      maximumVisibleDepth * COLUMN_GAP,
    height: Math.max(
      NODE_HEIGHT + WORLD_PADDING * 2,
      lastRowY + NODE_HEIGHT + WORLD_PADDING,
    ),
  };
}
