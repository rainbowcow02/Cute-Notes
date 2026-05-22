# Cute Notes

Write a note. Pick a vibe. Send a moment.

Cute Notes is a web app for sending beautifully designed, animated little notes to people you love — the kind of warmth that iMessage can't touch. Think craft stationary aesthetics, Animal Crossing coziness, and Partiful-level animation delight, all delivered as a URL.

## Purpose / Motivation

This project is an experiment in “vibe coding” by a non-technical product designer learning how to use AI-assisted development to prototype expressive, fun, interactive design tools.

The goal is to build an app that's both joyful and useful!

---

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

---

# Collaboration Principles

xxx

## Teaching While Building

Prioritize:
- explaining concepts in simple language
- communicating the Why in addition to the What
- using metaphors or parallels to design
- narrating major implementation decisions
- avoiding overwhelming technical detail

## Code Philosophy

Favor:
- semantic naming for HTML and CSS
- human readability
- simple architecture
- classes > in-line styles
- beginner-friendly code organization
- clear comments explaining intent

Avoid:
- nameless divs
- overengineering
- unnecessary complexity
- large unexplained refactors

## UX Standards

Prioritize:
- expressive, playful, yet refined visual language
- strong visual hierarchy
- accessibility
- comfortable spacing and typography
- clear interaction affordances
- smooth, joyful motion and microinteractions