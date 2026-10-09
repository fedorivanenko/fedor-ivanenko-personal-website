export const NODE_WIDTH = 280;
export const NODE_HEIGHT = 112;

const COLUMN_GAP = 150;
const ROW_GAP = 40;
const WORLD_PADDING = 64;

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
    summary: "5 items",
  },
  {
    kind: "document",
    id: "about",
    parentId: "fedor",
    name: "about.md",
    summary: "profile and approach",
    content: "I work across the entire product, from figuring out how it should behave and designing the interface to implementing the underlying systems and getting everything into production.",
  },
  {
    kind: "folder",
    id: "work",
    parentId: "fedor",
    name: "work/",
    summary: "3 documents",
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
    id: "experiments",
    parentId: "fedor",
    name: "experiments/",
    summary: "1 document",
  },
  {
    kind: "document",
    id: "contact",
    parentId: "fedor",
    name: "contact.md",
    summary: "start a conversation",
    content: "Available for selected product design and engineering engagements.",
  },
  {
    kind: "document",
    id: "alkamind",
    parentId: "work",
    name: "alkamind.md",
    summary: "Shopify theme rebuild",
    content: "Custom native Shopify theme architecture, frontend implementation, reusable sections, and storefront migration.",
  },
  {
    kind: "document",
    id: "exeter",
    parentId: "work",
    name: "exeter.md",
    summary: "Next.js and Sanity",
    content: "Editorial platform implementation with a Next.js frontend and structured Sanity content system.",
  },
  {
    kind: "document",
    id: "jadey",
    parentId: "work",
    name: "jadey.md",
    summary: "community platform",
    content: "Authentication experience, selected product surfaces, and interface motion built with Next.js, Sanity, and Supabase.",
  },
  {
    kind: "document",
    id: "product-design",
    parentId: "capabilities",
    name: "product-design.md",
    summary: "UX and interface design",
    content: "Product behavior, interaction systems, information architecture, interface design, and prototyping.",
  },
  {
    kind: "document",
    id: "engineering",
    parentId: "capabilities",
    name: "engineering.md",
    summary: "frontend and backend",
    content: "TypeScript, React, Next.js, APIs, data models, integrations, and production infrastructure.",
  },
  {
    kind: "document",
    id: "ai-systems",
    parentId: "capabilities",
    name: "ai-systems.md",
    summary: "LLMs and agents",
    content: "LLM integrations, agent orchestration, evaluation flows, workflow automation, and developer tooling.",
  },
  {
    kind: "document",
    id: "nazare",
    parentId: "experiments",
    name: "nazare.md",
    summary: "open-source Shopify tooling",
    content: "Liquid-first infrastructure for Shopify themes that stay easier to build, maintain, and evolve.",
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
