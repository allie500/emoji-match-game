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
- Vitest + React Testing Library (unit tests)

## Prerequisites

- Node.js 24 (LTS)
- npm 10+ (npm 11 ships with Node 24)

### Using nvm

If you use `nvm`, run:

```bash
nvm install
nvm use
```

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

## Git Hooks

This repo uses `husky` + `lint-staged` for local git hook checks.

- On `git commit`, only staged files are checked.
- Pre-commit runs:
  - ESLint on staged `*.js`, `*.jsx`, `*.ts`, `*.tsx`
  - Prettier write on staged code/config/docs files
- If a check fails, the commit is blocked until issues are fixed.
- On `git push`, direct pushes to `main` are blocked by a Husky pre-push guard.
- Push feature branches and open a pull request for `main` changes.

If hooks are missing locally after install, run:

```bash
npm run prepare
```

## Tests

Run the unit test suite once:

```bash
npm run test
```

Run tests in watch mode (re-runs on file changes):

```bash
npm run test:watch
```

Run tests with coverage (V8):

```bash
npm run test:coverage
```

Tests use **Vitest** with **jsdom** and **React Testing Library**. Configuration lives in `vite.config.ts` (`test` section); shared setup is in `src/test/setup.ts`.

## Accessibility Testing (Pa11y)

Install Chrome for Testing (required by Pa11y/Puppeteer):

```bash
npm run a11y:install-chrome
```

Run the default page scan:

```bash
npm run a11y
```

Run the face-up card scenario (uses `pa11y.faceup.json` to click a card before scanning):

```bash
npm run a11y:faceup
```

Run the full 2x2 matrix (light/dark x base/face-up):

```bash
npm run a11y:matrix
```

The matrix command covers:

- Base page in light mode
- Base page in dark mode
- Face-up interaction in light mode
- Face-up interaction in dark mode

If your app is running on a non-default URL, set `PA11Y_URL`:

```bash
PA11Y_URL=http://localhost:4173 npm run a11y:matrix
```

Recommended workflow: use `npm run a11y:matrix` for complete local coverage. The individual `a11y` and `a11y:faceup` scripts are still useful for quick, targeted checks.

Tests, build checks, and Pa11y scans are intended to be enforced by GitHub Actions on open PRs, not by local pre-commit hooks.

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
│  ├─ assets/
│  │  └─ audio/             # Sound effect files used by the game
│  ├─ audio/
│  │  ├─ sfx.ts             # Centralized sound effect loading/playback utility
│  │  └─ sfx.test.ts        # Unit tests for audio utility behavior
│  ├─ components/
│  │  ├─ Board.tsx          # Game board layout, stats, reset controls
│  │  └─ EmojiCard.tsx      # Individual card UI + flip state rendering
│  ├─ game/
│  │  ├─ emojiPool.ts       # Initial emoji set and selection helpers
│  │  ├─ game.ts            # Core game logic and reducer state transitions
│  │  └─ types.ts           # Shared game-related TypeScript types
│  ├─ App.tsx               # App-level state wiring and effects
│  ├─ main.tsx              # React app bootstrap
│  ├─ test/
│  │  └─ setup.ts           # Vitest + jest-dom setup
│  ├─ vite-env.d.ts         # Vite / Vitest type references
│  └─ index.css             # Global styles and Tailwind component styles
├─ index.html               # Vite HTML entry point
├─ tailwind.config.js       # Tailwind content/theme config
├─ postcss.config.js        # PostCSS plugin configuration
├─ vite.config.ts           # Vite config (plugins/dev server)
└─ package.json             # Scripts and dependencies
```

## Smartphone Testing via Tunnel (Optional)

If you use ngrok for mobile testing, make sure your Vite `server.allowedHosts` includes your ngrok host in `vite.config.ts`. Then bring up the development server with `npm run dev`, and point ngrok to the local server's URL. Lastly, on your phone, go to the ngrok URL and you should see the app.

```javascript
export default defineConfig({
  // ...your existing vite.config.ts,
  server: {
    allowedHosts: ["YOUR_NGROK_HOST.ngrok-free.app"],
  },
});
```

## Changelog

See [changelog.md](changelog.md) for the latest changes.
