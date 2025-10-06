import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface PageMetadata {
    title?: string;
    description?: string;
    path?: string;
}

export function generateMetadata({
    title = siteConfig.name,
    description = siteConfig.description,
    path = "/",
}: PageMetadata = {}): Metadata {
    const url = `${siteConfig.url}${path}`;
    const ogImage = `${siteConfig.url}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

    return {
        title,
        description,
        metadataBase: new URL(siteConfig.url),
        alternates: { canonical: path },
        openGraph: {
            type: "website",
            locale: "en_US",
            url,
            title,
            description,
            siteName: siteConfig.url,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            creator: siteConfig.author.twitter,
            images: [ogImage],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}
