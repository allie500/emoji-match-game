# Emoji Match Game

A simple browser-based emoji memory game built with React and TypeScript.

## App Overview

This project is a classic matching game:

- Flip cards to reveal emojis.
- Match pairs to mark them as solved.
- Mismatches flip back after a short delay.
- Moves and match count are tracked.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- ESLint + Prettier

## Prerequisites

- Node.js 20+ (or current LTS)
- npm 10+

## Install Dependencies

```bash
npm install
```

## Run the App Locally

Start the development server with hot reload:

```bash
npm run dev
```

By default, Vite serves at `http://localhost:5173`.

## Linting and Formatting

Run ESLint:

```bash
npm run lint
```

Check formatting:

```bash
npm run format:check
```

Auto-fix formatting:

```bash
npm run format
```

## Production Build

Create an optimized production build:

```bash
npm run build
```

The build output is generated in `dist/`.

## Preview Production Build Locally

```bash
npm run preview
```

## Deployment

This is a static frontend app. Deploy the `dist/` folder to any static host, such as:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages
- S3 + CloudFront

Typical deployment flow:

1. Install dependencies: `npm install`
2. Build app: `npm run build`
3. Upload/publish the `dist/` directory using your hosting provider's workflow

## Project Structure

```text
emoji-match-game/
├─ public/                  # Static assets served as-is
├─ src/
│  ├─ components/
│  │  ├─ Board.tsx          # Game board layout, stats, reset controls
│  │  └─ EmojiCard.tsx      # Individual card UI + flip state rendering
│  ├─ game/
│  │  ├─ emojiPool.ts       # Initial emoji set and selection helpers
│  │  ├─ game.ts            # Core game logic and reducer state transitions
│  │  └─ types.ts           # Shared game-related TypeScript types
│  ├─ App.tsx               # App-level state wiring and effects
│  ├─ main.tsx              # React app bootstrap
│  └─ index.css             # Global styles and Tailwind component styles
├─ index.html               # Vite HTML entry point
├─ tailwind.config.js       # Tailwind content/theme config
├─ postcss.config.js        # PostCSS plugin configuration
├─ vite.config.ts           # Vite config (plugins/dev server)
└─ package.json             # Scripts and dependencies
```

## Smartphone Testing via Tunnel (Optional)

If you use ngrok for mobile testing, make sure your Vite `server.allowedHosts` includes your ngrok host in `vite.config.ts`. Then bring up the development server with `npm run dev`, and point ngrok to the local server's URL. Lastly, on your phone, go to the ngrok URL and you should see the app.
