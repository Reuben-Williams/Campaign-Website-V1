# Morales for Assembly Campaign Website

Next.js static campaign website for Carmen Morales / Morales for Assembly. The current build is configured for static publishing and is ready for a custom domain when the campaign confirms domains and backend services.

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

## Static Publishing

The publishing workflow builds the static export with `PUBLISH_BASE_PATH=/Campaign-Website-V1`, which applies the base path needed for the public staging URL.

After pushing to `main`, the configured publishing action builds and releases the site.

## Future Backend Prep

- `.env.example` contains the future public site URL.
- Keep service-role or secret backend keys out of browser code and out of `NEXT_PUBLIC_*` variables.
