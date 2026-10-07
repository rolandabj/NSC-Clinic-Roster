---
name: browser-check
description: Checks the roster app's screens in a real browser (Chromium driven by Playwright) on a test page with fake data and a fake sign in, so no Firebase is needed. Use after changing anything people see or click (screens, dialogs, the roster grid, the problems panel), since the owner's rules ask for a browser check of every screen change, and to reproduce a bug report in the browser.
---

# Browser check

The test page serves the app's own screens with Vite from a temporary `_preview/` folder
(ignored by git and by the type check). Two modules are swapped for in memory fakes: the
database (`src/services/repository/index.ts`) and the sign in (`src/services/auth/authService.ts`),
so the page runs signed in with no Firebase. Playwright is installed globally, with Chromium
in `/opt/pw-browsers`; never run `playwright install`.

## Steps

1. **Start**: `bash .claude/skills/browser-check/scripts/start.sh`. It copies `harness/` to
   `_preview/` and serves it at http://localhost:5179 (it waits until the page answers).
   `bash .../start.sh prod` builds the page for production and serves it at
   http://localhost:5180: use it for timings, because React's development build is several
   times slower (the full size roster: 1.9 s to show its cells in development, 1.0 s built).
2. **Pick the screen, the person and the data** in the address:
   - `?view=` one screen: `schedules` (the default), `doctors`, `availability`, `history`,
     `nurses`, `reports`, `dashboard`; or `app`, the whole app with its sidebar and top bar,
     where the part after `#` picks the screen (`?view=app&as=nurse#availability`); or the
     pages nurses open from links: `me` (their private page), `published` (a shared roster)
     and `ack` (the read receipt page). These three publish the November roster on the spot.
   - `?as=` who is signed in: `owner` (the default), `planner`, `manager`, `nurse` (Mary,
     a viewer linked to her nurse profile) or `none` (signed out, for the sign in page).
   - `?seed=` other data: `fair` (Amy well over her goal), `big` (a full size clinic:
     60 nurses with long names, 12 doctors, a 31 day roster from 02-11-2026) or `clean`
     (a one day roster with nothing to fix, so the publish dialog goes on to sending).
   - `?email=live` takes email out of test mode. The test page has no email server, so a
     script answers it: `page.route('**/api/email/status', ...)`, `/api/email/check` and
     `/api/email/test` (reply `{ data: { status: 'SENT' } }`, slowly to watch the sending).
   The sample data is in `_preview/seed.ts`: a draft November 2026 roster, Dr Lee (Mondays)
   and Dr Ray (Tuesdays), and Mary, whose list holds only Dr Lee. Add variants behind a URL
   parameter, as `?seed=fair` does, to check several cases with one page.
3. **Measure** with the two scripts here, run with `NODE_PATH=$(npm root -g) node <script>`:
   - `scripts/ui-audit.cjs <folder>`: screenshots at 1366, 1024 and 390 px and an axe
     accessibility scan of a list of pages (`--pages "view=nurses;view=app&as=nurse#dashboard"`,
     `--sizes 1366x768,390x844`, `--base http://localhost:5180`). It prints one line per page
     and width: serious axe problems, other axe problems, controls smaller than 24 px, text
     under 12 px, the width left for the page's content and boxes that cut their content off.
     axe is fetched once into `~/.cache/nsc-browser-check` (it is not an app dependency).
   - `scripts/grid-timing.cjs --base http://localhost:5180`: the full size roster's timings
     (cells shown, popup, arrow key, deleting a shift, and the longest task that blocked the
     page), the median of three runs.
4. **Script other checks** in the session scratchpad, not in the repo, starting from
   `scripts/example.cjs`. Run it with `NODE_PATH=$(npm root -g) node <script> <folder>`.
   - Wait for the grid with a cell: `[data-cell="<nurse id>|<YYYY-MM-DD>"]`.
   - Menus: `getByRole('button', { name: 'More actions' })`, then a `menuitem` by name.
   - Dialogs: `getByRole('dialog', { name: '...' })`. Confirmations are `alertdialog`;
     use exact button names there.
   - What the app saved: `page.evaluate(() => [...window.__repo.col('assignments').values()])`.
   - A failed save (daily quota): `page.evaluate(() => { window.__repo.failWrites = true; })`.
   - Take screenshots, look at them with Read, and report page errors and console errors.
5. **Stop**: `bash .claude/skills/browser-check/scripts/stop.sh` stops both servers and deletes
   `_preview/`. Do this before committing.

## Things that went wrong before

- No styles on the page: Tailwind needs `@source "../src"` (in `preview.css`).
- `ss` and `lsof` are missing; `stop.sh` finds the server through `/proc`.
- Live listeners answer after 20 ms: wait a moment after a write before reading the screen.
- A screen that imports something new from the database or sign in module fails to load:
  add it to `fakeRepo.ts` or `fakeAuth.ts` here (they export what the real modules export:
  `getRepository`, `repositoryManager`, `FirestoreRepository`; `MASTER_ADMIN_EMAIL`,
  `computePrivileges`, `AuthService`, `authService`, `authorizedFetch`).
- Some screens use today's date (for example the doctor week change dialog's first date),
  so keep test dates in the future or set the date in the script.
- Headless Chromium never shows "Leave site?" warnings, even for a page that asks. To check
  that a page would ask, dispatch the event yourself:
  `page.evaluate(() => { const e = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(e); return e.defaultPrevented; })`.
- A nurse's private page needs a private link before its page is written: `main.tsx` calls
  `ensureNurseLink` and then `syncNurseRosters`, as publishing does.
- The page rarely scrolls sideways even when a phone layout is broken, because the app
  scrolls inside boxes: read the audit's "main width" (on 07-10-2026 the app left 166 px
  of a 390 px phone for its content, beside the sidebar) and "cut off boxes" instead.
