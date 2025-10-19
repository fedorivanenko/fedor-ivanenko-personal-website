const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const siteConfig = {
  name: "Fedor Ivanenko",
  url: baseUrl,
  description: "designer + engineer",
  author: {
    name: "Fedor Ivanenko",
    twitter: "@fedorivanenko_",
  },
};
