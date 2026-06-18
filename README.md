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
- **Hosting:** AWS S3 behind CloudFront — live site at [https://emojimatchgame.net/](https://emojimatchgame.net/)

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

### This repository

Production deploys for this repo are automated via GitHub Actions (see [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

#### Triggers

- Push to `main` (automatic)
- Manual run via GitHub Actions `workflow_dispatch`

#### Workflow

1. Checkout, Node.js 24, `npm ci`
2. `npm run build` → output in `dist/`
3. Configure AWS credentials from repository secrets
4. `aws s3 sync dist/ s3://<bucket>/ --delete`
5. `aws cloudfront create-invalidation --distribution-id <id> --paths "/*"`

Deploys are serialized via workflow concurrency (`group: deploy`, `cancel-in-progress: false`) so overlapping `main` pushes do not cancel an in-flight deploy.

The intended release path is feature branch → pull request → merge to `main` → deploy. Direct pushes to `main` are blocked locally by Husky (see Git Hooks).

**Required GitHub secrets** (for maintainers): `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_CLOUDFRONT_DIST_ID`.

## Project Structure

```text
emoji-match-game/
├─ .github/
│  ├─ pull_request_template.md
│  └─ workflows/            # CI and deploy GitHub Actions workflows
├─ .husky/                  # Git hooks (pre-commit, pre-push)
├─ public/
│  ├─ favicon.svg
│  └─ icons.svg
├─ scripts/
│  └─ run-pa11y-matrix.mjs  # Pa11y matrix runner used by a11y:matrix
├─ src/
│  ├─ assets/
│  │  ├─ audio/             # Sound effect files used by the game
│  │  ├─ hero.png           # Hero/header image
│  │  ├─ react.svg
│  │  └─ vite.svg
│  ├─ audio/
│  │  ├─ sfx.ts             # Centralized sound effect loading/playback utility
│  │  └─ sfx.test.ts        # Unit tests for audio utility behavior
│  ├─ components/
│  │  ├─ Board.tsx          # Game board layout, stats, reset controls
│  │  ├─ Board.test.tsx     # Unit tests for Board
│  │  ├─ EmojiCard.tsx      # Individual card UI + flip state rendering
│  │  ├─ EmojiCard.test.tsx # Unit tests for EmojiCard
│  │  ├─ Footer.tsx         # Site footer
│  │  ├─ Footer.test.tsx    # Unit tests for Footer
│  │  ├─ InfoModal.tsx      # How-to-play / info modal
│  │  ├─ InfoModal.test.tsx # Unit tests for InfoModal
│  │  ├─ WinOverlay.tsx     # Win celebration overlay
│  │  └─ WinOverlay.test.tsx # Unit tests for WinOverlay
│  ├─ game/
│  │  ├─ emojiPool.ts       # Initial emoji set and selection helpers
│  │  ├─ emojiPool.test.ts  # Unit tests for emoji pool helpers
│  │  ├─ emojiSetStorage.ts # localStorage persistence for emoji set choice
│  │  ├─ emojiSetStorage.test.ts # Unit tests for emoji set storage
│  │  ├─ game.ts            # Core game logic and reducer state transitions
│  │  ├─ game.test.ts       # Unit tests for game logic
│  │  └─ types.ts           # Shared game-related TypeScript types
│  ├─ App.tsx               # App-level state wiring and effects
│  ├─ App.test.tsx          # Unit tests for App
│  ├─ App.css               # App-level component styles
│  ├─ main.tsx              # React app bootstrap
│  ├─ test/
│  │  └─ setup.ts           # Vitest + jest-dom setup
│  ├─ theme.ts              # Light/dark theme preference helper
│  ├─ vite-env.d.ts         # Vite / Vitest type references
│  └─ index.css             # Global styles and Tailwind component styles
├─ index.html               # Vite HTML entry point
├─ pa11y.ci.json            # Pa11y CI scenario config
├─ pa11y.faceup.json        # Pa11y face-up card scenario config
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
