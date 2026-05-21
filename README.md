# Cute Notes

Write a note. Pick a vibe. Send a moment.

A web app for sending beautifully designed, animated little notes — snail-mail warmth, delivered as a URL.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) locally, or the live app at [https://cute-notes-roan.vercel.app](https://cute-notes-roan.vercel.app).

Share links always point to the public URL. Override with `VITE_PUBLIC_APP_URL` in `.env.local` if you use a custom domain.

## Core flow

1. **Compose** — Pick one of 6 card styles, write salutation / body / valediction, choose a particle animation
2. **Preview** — See the card with animations before sending
3. **Share** — Copy a public link on [cute-notes-roan.vercel.app](https://cute-notes-roan.vercel.app) (`/n/...`) — note data is encoded in the URL (no backend required for v1). Links always use the deployed URL, even when composing on localhost.
4. **Receive** — Sealed envelope → tap to open → card reveal with particles

## Stack

- React + TypeScript + Vite
- React Router
- Canvas particle effects
- Google Fonts (Itim, Jersey 15, Kurale)
