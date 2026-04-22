<!-- markdownlint-disable MD024 -->

# Changelog

All notable changes to this project will be documented in this file.

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
