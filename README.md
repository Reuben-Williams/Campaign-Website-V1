# Morales for Assembly Campaign Website Demo

Next.js static demo for Carmen Morales / Morales for Assembly. The current build is configured for GitHub Pages and is ready to move to Vercel when the campaign confirms domains and backend services.

## Local Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm test
npm run typecheck
npm run build
```

## GitHub Pages

The workflow in `.github/workflows/pages.yml` builds the static export with `GITHUB_PAGES=true`, which applies the `/Campaign-Website-V1` base path needed for the repository Pages URL.

After pushing to `main`, enable Pages in GitHub with **Source: GitHub Actions**.

## Vercel And Supabase Prep

- `.env.example` contains the future public site URL and Supabase browser variables.
- `src/lib/supabase/client.ts` exports `getSupabaseBrowserClient()`, which returns `null` until `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured.
- Keep service-role or secret Supabase keys out of browser code and out of `NEXT_PUBLIC_*` variables.
