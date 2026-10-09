import { ImageResponse } from "next/og";

export const runtime = "edge";

const commitMono = fetch(
  new URL(
    "../../../public/fonts/CommitMono-400-Regular.woff",
    import.meta.url,
  ),
).then((response) => response.arrayBuffer());

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#151515",
        color: "#e8e8e3",
        fontFamily: "Commit Mono",
        fontSize: 18,
      }}
    >
      <svg
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        style={{ position: "absolute", inset: 0 }}
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="dot-grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="#30312e" />
          </pattern>
        </defs>
        <rect width="1200" height="630" fill="url(#dot-grid)" />
      </svg>

      <div
        style={{
          width: 280,
          height: 112,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 16,
          border: "1px solid #ff6846",
          background: "#1b1c1a",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#8f908b",
          }}
        >
          <span>~</span>
          <span>□</span>
        </div>
        <div style={{ display: "flex" }}>fedor/</div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#8f908b",
          }}
        >
          <span>5 items</span>
          <span>CLOSED</span>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Commit Mono",
          data: await commitMono,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
