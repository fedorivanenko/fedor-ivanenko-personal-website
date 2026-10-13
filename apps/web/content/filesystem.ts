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
    content: `I'm Fedor Ivanenko, an independent AI engineer. I design and build complex interfaces, tools, and AI-native systems from early concepts to production.

I believe we're at the dawn of AI-native software. A lot is going to change about how we build and use software, but my standards for it are simple: fast, intuitive, and nice-looking.

I'm currently building Nazare, a self-improving system for autonomous software evolution. The idea is that software can learn from its own changes, making each subsequent modification cheaper and more reliable. The long-term goal is lights-off software engineering.

I like working directly with engineers, making decisions quickly, and keeping boundaries clear. I use this site to share what I'm building, researching, and experimenting with.`,
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

GEO Ops is an AI-powered operations platform built for Hyuman, a generative engine optimization agency

It turns the agency's manual research, analysis, and reporting processes into automated workflows with human review at critical steps

The system researches potential clients, evaluates their visibility across AI search engines, analyzes competitors, and generates evidence-checked sales presentations.

I'm designing and engineering the platform end-to-end, including its interface, workflow engine, AI pipelines, and infrastructure.`,
  },
  {
    kind: "document",
    id: "nazare",
    parentId: "work",
    name: "nazare.md",
    summary: "Founder & Engineer",
    content: `Nazare
Founder & Engineer

I'm building Nazare, a self-improving AI system for autonomous software development.

The idea is that software can learn from how it changes and become easier to modify over time. Nazare explores this by learning the behavior of individual codebases, testing possible changes, and improving both the software and the process used to change it.`,
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
    content: `AI Systems Engineering

I build agentic systems that combine LLMs, tools, and APIs to automate complex workflows. From orchestration and integrations to human-in-the-loop review and intervention`,
  },
  {
    kind: "document",
    id: "product-design",
    parentId: "capabilities",
    name: "product-design.md",
    summary: "UX and interface design",
    content: `Design Engineering

I design and build complex, interactive interfaces for AI products and operational software. Dashboards, visual tools, data-heavy applications, and interfaces that make sophisticated systems intuitive to use`,
  },
  {
    kind: "document",
    id: "engineering",
    parentId: "capabilities",
    name: "engineering.md",
    summary: "frontend and backend",
    content: `Full-Stack Engineering

I take products from early prototypes to production, working across frontend, backend, APIs, and third-party integrations.`,
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
