<!-- markdownlint-disable MD024 -->

# Changelog

All notable changes to this project will be documented in this file.

## [0.0.13] - 2026-04-30

### Added

- Added a Husky `.husky/pre-push` hook that blocks direct pushes targeting `main`, including explicit refspec pushes.

### Changed

- Updated `README.md` Git Hooks documentation to include the new pre-push protection workflow.

## [0.0.12] - 2026-04-26

### Added

- Win celebration overlay when the board is cleared: the last matched emoji animates in at the center, “YOU WON” and a “Play Again” control appear. Implemented in `src/components/WinOverlay.tsx` with styles in `src/index.css`.
- `winningEmoji` on `GameState` so the UI can show the final pair’s emoji; set in `resolveMatch` on the winning match, cleared on new game.

### Changed

- `src/components/Board.tsx` and `src/App.tsx` pass `winningEmoji` and render the overlay instead of the previous inline “You won!” line beside Reset.
- Extended tests in `src/game/game.test.ts`, `src/components/Board.test.tsx`, and `src/App.test.tsx`, plus new `src/components/WinOverlay.test.tsx`, to cover the feature and keep coverage thresholds green.

## [0.0.11] - 2026-04-26

### Changed

- Updated the app header title in `src/App.tsx` to render `🤔 Emoji Match 🎉` for a more playful presentation.
- Updated `src/App.test.tsx` to assert the revised accessible heading text so test coverage remains aligned with the UI change.

## [0.0.10] - 2026-04-26

### Added

- Added a new GitHub Actions deploy workflow at `.github/workflows/deploy.yml` to build the app, sync `dist/` to S3, and invalidate CloudFront on `main` branch deploys.

### Changed

- Deployment automation now uses repository secrets `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`, and `AWS_CLOUDFRONT_DIST_ID`, with serialized deploy execution via workflow concurrency (`group: deploy`, `cancel-in-progress: false`).

## [0.0.9] - 2026-04-24

### Added

- GitHub Actions workflows for open, non-draft pull requests: `tests`, `coverage`, `lint`, `format-check`, `build`, and `a11y` (triggers: `pull_request` with `opened`, `reopened`, `synchronize`, `ready_for_review`; jobs skip draft PRs).
- `pa11y.ci.json` and npm script `a11y:ci` so Pa11y uses Chrome with `--no-sandbox` in Linux CI (GitHub Actions).

### Changed

- Accessibility workflow runs `npm run a11y:ci` and `npm run a11y:faceup` after starting the Vite dev server, matching local Pa11y usage.

## [0.0.8] - 2026-04-23

### Added

- Added `husky` and `lint-staged` as dev dependencies to support repo-managed pre-commit checks.
- Added a new `.husky/pre-commit` hook that runs `lint-staged` so only staged files are validated at commit time.

### Changed

- Added a `prepare` script in `package.json` so Husky hooks are installed automatically after dependency install.
- Configured `lint-staged` to run ESLint on staged JS/TS files and Prettier write on staged code/config/docs files.
- Updated `README.md` with a dedicated pre-commit workflow section and clarified that tests/build/Pa11y checks are enforced in PR GitHub Actions.
- Updated `.github/pull_request_template.md` to add a `How to test` section for clearer reviewer validation steps.

## [0.0.7] - 2026-04-23

### Added

- Added project-local Pa11y support as a dev dependency and introduced a dedicated `pa11y.faceup.json` config to validate an interacted game state (flip one card before scanning).
- Added npm scripts for accessibility workflows: `a11y:install-chrome`, `a11y`, and `a11y:faceup`.

### Changed

- Improved text color contrast in the game header, board stats, and footer/link actions to satisfy WCAG AA checks reported by Pa11y.
- Updated `README.md` with step-by-step accessibility testing instructions, including Chrome-for-Testing install and both initial-state and face-up-state scan commands.

## [0.0.6] - 2026-04-22

### Added

- Added a new app footer with a dynamic year copyright notice and a centered GitHub repo link with accessible metadata.
- Added legal/info modal support for `Credits`, `Terms of Use`, and `Privacy Policy` via new `Footer` and reusable `InfoModal` components.
- Added dedicated unit test suites for `Footer` and `InfoModal`, plus an app-level assertion that footer content renders with the game UI.

### Changed

- Updated the credits modal placeholder text to include attribution for Pixabay sound effects.
- Refined footer layout so copyright, centered GitHub icon, and legal links align cleanly across screen sizes.

## [0.0.5] - 2026-04-20

### Added

- Added game sound effect support with a centralized audio utility and dedicated audio asset directory under `src/assets/audio`.
- Added a new `src/audio/sfx.test.ts` suite covering playback reuse, error handling, and no-audio runtime behavior.

### Changed

- Wired sound triggers for card flip, mismatch resolution, reset, successful match, and win events in the app flow.
- Updated `App` tests to assert sound-effect calls for gameplay and win conditions.
- Tightened coverage enforcement to require per-file 100% statements/branches/functions/lines for `src/game/**`, `src/components/**`, and `src/audio/**`.

## [0.0.4] - 2026-04-20

### Changed

- Updated face-up card styling to add a clearer border so revealed cards stand out from the board background.
- Removed disabled-state opacity from cards so face-down card shading stays consistent while match checks are resolving.

## [0.0.3] - 2026-04-17

### Added

- Added a pull request template to the project.

### Changed

- Updated the changelog.md file to include the changes in this pull request.

## [0.0.2] - 2026-04-16

### Added

- Added unit tests and integration tests.

### Changed

- Updated the README.md file to include more information about the project.
- Updated the index.html file to include more information about the project.

## [0.0.1] - 2026-04-16

### Added

- Initial release of the emoji match game.

### Changed

- Updated the README.md file to include more information about the project.
