This repository now uses a lightweight [Turborepo](https://turbo.build/repo) setup so multiple apps/packages can live side-by-side. The existing Next.js site lives in `apps/web`.

## Getting Started

Install dependencies (pnpm is recommended for workspaces):

```bash
pnpm install
```

Run any pipeline target through Turbo:

```bash
pnpm dev    # turbo run dev --filter=web
pnpm build  # turbo run build
pnpm lint   # turbo run lint
pnpm start  # turbo run start --filter=web
```

Open [http://localhost:3000](http://localhost:3000) after running `pnpm dev` to see the site.

Next.js code continues to live under `apps/web`. Most shared configuration such as TypeScript options now resides at the repo root so future packages/apps can reuse it.

## Contact form

Configure these encrypted environment variables in Vercel and local development:

```text
RESEND_API_KEY
CONTACT_FROM_EMAIL
CONTACT_TO_EMAIL
```

`CONTACT_FROM_EMAIL` must use a Resend-verified sending domain. Recipient and sender addresses remain server-only. BotID Basic protects `POST /api/contact`; for another abuse-control layer, add a Vercel Firewall rate-limit rule for that route.
