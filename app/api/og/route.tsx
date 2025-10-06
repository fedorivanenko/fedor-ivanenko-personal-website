import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };

async function loadGoogleFont (font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url)).text()
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)
 
  if (resource) {
    const response = await fetch(resource[1])
    if (response.status == 200) {
      return await response.arrayBuffer()
    }
  }
 
  throw new Error('failed to load font data')
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? siteConfig.name;
  const description = searchParams.get("description") ?? siteConfig.description

  console.log("title: ", title)
  console.log("desc: ",description)

  return new ImageResponse(
    <div
      style={{
        fontFamily: "Geist",
        background: "#171717",
        color: "#f7f7f7",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-start", 
        padding: "100px"
      }}
    >
      <div
      style={{
        fontSize: 44,
      }}
      >
      {title}
      </div>
      <div style={{
        fontSize: 44,
        color:"#cecece"
      }}>
      {description}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: 'Geist',
          data: await loadGoogleFont('Geist', title+description),
          style: 'normal',
        },
      ],
    },
  );
}
