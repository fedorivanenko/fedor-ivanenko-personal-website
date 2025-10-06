const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const siteConfig = {
  name: "Fedor Ivanenko",
  url: baseUrl,
  description: "React / Next.js developer and UX designer",
  author: {
    name: "Fedor Ivanenko",
    twitter: "@fedorivanenko_",
  },
};
