export const WORLD_WIDTH = 1540;
export const WORLD_HEIGHT = 1200;
export const NODE_HEIGHT = 112;

interface BaseNode {
  id: string;
  parentId?: string;
  x: number;
  y: number;
  width: number;
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

export const nodes: FileSystemNode[] = [
  {
    kind: "folder",
    id: "fedor",
    x: 180,
    y: 470,
    width: 280,
    name: "fedor/",
    summary: "5 items",
  },
  {
    kind: "document",
    id: "about",
    parentId: "fedor",
    x: 610,
    y: 80,
    width: 280,
    name: "about.md",
    summary: "profile and approach",
    content: "I work across the entire product, from figuring out how it should behave and designing the interface to implementing the underlying systems and getting everything into production.",
  },
  {
    kind: "folder",
    id: "work",
    parentId: "fedor",
    x: 610,
    y: 280,
    width: 280,
    name: "work/",
    summary: "3 documents",
  },
  {
    kind: "folder",
    id: "capabilities",
    parentId: "fedor",
    x: 610,
    y: 480,
    width: 280,
    name: "capabilities/",
    summary: "3 documents",
  },
  {
    kind: "folder",
    id: "experiments",
    parentId: "fedor",
    x: 610,
    y: 680,
    width: 280,
    name: "experiments/",
    summary: "1 document",
  },
  {
    kind: "document",
    id: "contact",
    parentId: "fedor",
    x: 610,
    y: 880,
    width: 280,
    name: "contact.md",
    summary: "start a conversation",
    content: "Available for selected product design and engineering engagements.",
  },
  {
    kind: "document",
    id: "alkamind",
    parentId: "work",
    x: 1040,
    y: 180,
    width: 280,
    name: "alkamind.md",
    summary: "Shopify theme rebuild",
    content: "Custom native Shopify theme architecture, frontend implementation, reusable sections, and storefront migration.",
  },
  {
    kind: "document",
    id: "exeter",
    parentId: "work",
    x: 1040,
    y: 320,
    width: 280,
    name: "exeter.md",
    summary: "Next.js and Sanity",
    content: "Editorial platform implementation with a Next.js frontend and structured Sanity content system.",
  },
  {
    kind: "document",
    id: "jadey",
    parentId: "work",
    x: 1040,
    y: 460,
    width: 280,
    name: "jadey.md",
    summary: "community platform",
    content: "Authentication experience, selected product surfaces, and interface motion built with Next.js, Sanity, and Supabase.",
  },
  {
    kind: "document",
    id: "product-design",
    parentId: "capabilities",
    x: 1040,
    y: 610,
    width: 280,
    name: "product-design.md",
    summary: "UX and interface design",
    content: "Product behavior, interaction systems, information architecture, interface design, and prototyping.",
  },
  {
    kind: "document",
    id: "engineering",
    parentId: "capabilities",
    x: 1040,
    y: 750,
    width: 280,
    name: "engineering.md",
    summary: "frontend and backend",
    content: "TypeScript, React, Next.js, APIs, data models, integrations, and production infrastructure.",
  },
  {
    kind: "document",
    id: "ai-systems",
    parentId: "capabilities",
    x: 1040,
    y: 890,
    width: 280,
    name: "ai-systems.md",
    summary: "LLMs and agents",
    content: "LLM integrations, agent orchestration, evaluation flows, workflow automation, and developer tooling.",
  },
  {
    kind: "document",
    id: "nazare",
    parentId: "experiments",
    x: 1040,
    y: 1030,
    width: 280,
    name: "nazare.md",
    summary: "open-source Shopify tooling",
    content: "Liquid-first infrastructure for Shopify themes that stay easier to build, maintain, and evolve.",
  },
];

export const nodeById = new Map(nodes.map((node) => [node.id, node]));

export function isNodeVisible(
  node: FileSystemNode,
  expandedFolders: Set<string>,
): boolean {
  if (!node.parentId) return true;
  const parent = nodeById.get(node.parentId);
  if (!parent || !expandedFolders.has(parent.id)) return false;
  return isNodeVisible(parent, expandedFolders);
}
