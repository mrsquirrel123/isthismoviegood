# IsThisMovieGood.com - Real MVP

Next.js starter wired for TMDB movie search and Supabase movie/vote storage.

## 1. Install

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` with your TMDB API Read Access Token and Supabase credentials.

## 2. Supabase

Create a Supabase project and run `supabase/schema.sql` in the SQL Editor.

Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only. Never expose it with `NEXT_PUBLIC_`.

## 3. Run locally

```bash
npm run dev
```

Open http://localhost:3000.

## 4. Deploy

Push to GitHub, import into Vercel, add the same environment variables, then add `isthismoviegood.com` as the custom domain in Vercel. Update your DNS records at your domain registrar using the records Vercel provides.

## Rating rule

- Fewer than 100 votes: UNRATED
- 100+ votes and >=70% good: YES
- 100+ votes and <70% good: NO

## Important production TODOs

- Replace the simple voter hash with a robust anti-abuse/rate-limiting system.
- Add a proper privacy policy, terms, cookie/consent handling as applicable.
- Add sitemap/robots and richer per-movie metadata.
- Add TMDB attribution according to current TMDB requirements.
- Add monitoring and error logging.
- Review Supabase RLS policies before public launch.
# isthismoviegood
