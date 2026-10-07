# Design system: NSC Clinic Roster

> **How to use this file:** when building a screen, check `design-system/nsc-clinic-roster/pages/<screen>.md` first.
> If that file exists, its rules come first. If not, follow this file.
> The owner's rules in `PROJECT_GUIDE.md` (plain English, no hyphens in prose, DD-MM-YYYY dates) come before both.

**Status:** proposed on 07-10-2026 and shown as a sample on the test page (`?view=sample` for a planner's
roster screen, `?view=sample-nurse` for a nurse's phone page). It waits for the owner's approval; no
real screen uses it yet. After approval the colours move into `src/index.css` (Tailwind `@theme`) and
the parts into `src/components/ui/` (UI overhaul Phase 2, `tasks/plan.md`).

**Where it comes from:** the `ui-ux-pro-max` skill (`--design-system`, "healthcare clinic staff
scheduling dashboard calm trustworthy", density 8), then edited:

* Kept: the calm teal brand and the healthcare palette, the data dense dashboard style (8 to 12 px gaps,
  36 px rows), a highly legible sans font, visible focus, 150 to 300 ms motion that honours reduced
  motion, no emoji as icons.
* Changed: the brand is one shade darker (`#0E7490` instead of `#0891B2`) so white text on it reaches
  5.4:1; text on the main button is white, not black; the generator's light teal page background,
  teal borders and teal text gave way to neutral slate, which keeps the roster's own colours readable.
* Left out: its page pattern (a marketing page with testimonials), its style (Neumorphism, soft
  embossed shadows that are hard to see), cards that lift on hover, and 12 px by 24 px button padding
  (too large for a dense roster).
* Font: the generator suggested Atkinson Hyperlegible. Its newer version, Atkinson Hyperlegible Next,
  draws every zero with a slash (09:00 looks like Ø9:ØØ) and has no plain zero in the Google Fonts
  files, which is noisy in a roster full of times and dates. Inter is proposed instead; Atkinson stays
  as the alternative (`&font=atkinson` on the sample).

## Colours

Only these colours exist in the sample's stylesheet (Tailwind's own palette is switched off), which
proves they are enough. Contrast is against white unless noted; text needs 4.5:1, borders and icons
that carry meaning need 3:1.

| Role | Token | Hex | Use | Contrast |
|------|-------|-----|-----|----------|
| Brand | `--color-brand` | `#0E7490` | Main buttons, links, the open menu item | white text 5.4:1 |
| Brand, strong | `--color-brand-strong` | `#155E75` | Hover and pressed; text on brand soft | 7.0:1 on brand soft |
| Brand, soft | `--color-brand-soft` | `#ECFEFF` | Selected rows, the open menu item, the next shift card | |
| Page | `--color-canvas` | `#F8FAFC` | Page background | |
| Surface | `--color-surface` | `#FFFFFF` | Cards, tables, dialogs | |
| Sunken | `--color-sunken` | `#F1F5F9` | Table headers, weekends, hover | |
| Line | `--color-line` | `#E2E8F0` | Card borders, dividers | decoration only |
| Line, strong | `--color-line-strong` | `#CBD5E1` | Roster grid lines, plain buttons | decoration only |
| Field border | `--color-control` | `#64748B` | Borders of text fields and selects | 4.8:1 |
| Text | `--color-ink` | `#0F172A` | All main text | 17.9:1 |
| Text, muted | `--color-ink-muted` | `#475569` | Second level text, hints, labels in tables | 7.6:1, 6.9:1 on sunken |
| Danger | `--color-danger` / `-soft` / `-line` | `#B91C1C` / `#FEF2F2` / `#DC2626` | Must fix, errors | 6.5:1, 5.9:1 on soft |
| Warning | `--color-warning` / `-soft` / `-line` | `#92400E` / `#FFFBEB` / `#D97706` | Check, Waiting, hours short | 7.1:1, 6.8:1 on soft |
| Success | `--color-success` / `-soft` | `#047857` / `#ECFDF5` | Approved, saved, done steps | 5.5:1, 5.2:1 on soft |
| Info | `--color-info` / `-soft` | `#1D4ED8` / `#EFF6FF` | Note, information | 6.7:1, 6.2:1 on soft |
| Focus | `--color-focus` | `#0891B2` | The keyboard focus ring (2 px, 2 px away) | 3.7:1 |

Two levels of text only: `ink` and `ink-muted`. A lighter grey (`#64748B`) failed on the sunken
background (4.3:1), so it is kept for field borders and never used for text.

**Shift and leave colours** are chosen by planners in Settings and stored with the data. The grid shows
them as a light tint (10 % of the colour on white) with a 3 px edge in the full colour, and the text on
them stays `ink` and `ink-muted` (6:1 or more on every tint tried, black included). The real app will work the tint
out in one helper, so the text is always readable whatever colour a planner picks.

## Roster marks

Never colour alone: each mark has its own shape and its word.

| Mark | Icon (lucide) | Colour | Word |
|------|---------------|--------|------|
| Must fix | `OctagonAlert` | danger | "Must fix" |
| Check | `TriangleAlert` | warning | "Check" |
| Note | `Info` | info | "Note" |
| Pinned day | `Pin` | brand strong | "Pinned day" |

One count everywhere: "2 must fix · 2 to check · 1 note". A cell with a Must fix problem also gets a
1 px danger outline. The key above the grid lists every mark and shift colour.

## Type

* **Font:** Inter (Google Fonts, weights 400, 500, 600 and 700), with the system sans font as fallback.
  One font for everything: no monospace for words or numbers.
* **Sizes:** 12 px is the smallest anywhere (labels in tables, hints, grid cells); 14 px is the body
  text of planner screens; 16 px is the body text of nurse pages and of any text field on a touch
  screen (so phones do not zoom in); headings 16 px (cards), 20 px (dialogs, a nurse's next shift)
  and 24 px (page titles).
* **Weights:** 400 for text, 500 for menu items and tabs, 600 for headings, names and buttons, 700
  only for the app name.
* **Numbers:** `tabular-nums` (digits of equal width) where numbers sit in columns: the grid, hours,
  tables and summary numbers. Not in sentences, where it spaces dates out.
* **Line height:** 1.5 for text, tighter (1.25) inside grid cells.

## Dates and times

* Dates are DD-MM-YYYY (`16-11-2026`); with the day, `Mon 16-11-2026`; a range is
  `16-11-2026 to 29-11-2026`; times are `09:00 to 17:00`. A range always uses "to", never a dash.
* A date never breaks across lines at its dashes (`whitespace-nowrap` on each date).
* **Date fields** show and take DD-MM-YYYY whatever the browser's language, with the browser's own
  calendar on a button beside the field (`DateInput` in the sample). The browser's own date field
  showed 12/21/2026 on a computer set to US English, which breaks the owner's date rule. A date that
  is not real (31-02-2027) is reported when the person leaves the field: "Enter the last day as
  DD-MM-YYYY, for example 21-12-2026."

## Spacing, shape, depth and motion

* **Spacing:** steps of 4 px (4, 8, 12, 16, 24, 32). Cards have 16 px inside; gaps between cards 12 to
  16 px; table cells 12 px across and 6 to 8 px down.
* **Radius:** 4 px (badges, grid cells), 6 px (buttons, fields), 8 px (cards), 12 px (dialogs and the
  nurse's next shift card).
* **Shadows:** cards `0 1px 2px` at 6 % (`--shadow-card`); menus and messages `--shadow-pop`; dialogs
  `--shadow-dialog`. Nothing moves or lifts on hover; hover changes the background only.
* **Motion:** colour changes 150 ms; dialogs and messages come in over 180 ms (fade and a 4 px rise).
  With reduced motion turned on, nothing moves.

## Sizes of controls

* Laptop: buttons 36 px high (32 px for small ones in tables), text fields 36 px, menu items 36 px, tabs
  44 px, grid cells 44 px high and at least 60 px wide.
* Touch screens (`pointer-coarse`): every button, field and menu item at least 44 px.
* Nothing anyone can click is under 24 px anywhere.

## Parts (first drafts in `.claude/skills/browser-check/harness/sample/`)

* **App frame:** a white sidebar (224 px) with the app name, the clinic and plain menu labels; the open
  item in brand soft. Below 1024 px it becomes a menu that opens over the page from a Menu button.
  A white top bar with the clinic and the account button. A "Skip to main content" link comes first.
* **Page header:** a breadcrumb, the title, then one line with the dates, a status badge and the save
  state ("All changes saved"), and the actions on the right: plain buttons, then the main button, then
  More.
* **Steps:** Create, Fill, Fix problems, Publish, with done steps ticked; on a phone, one line:
  "Step 3 of 4: Fix problems · 2 must fix".
* **Summary cards:** a label (with its mark's icon), a large number, and a short hint.
* **Tabs:** the ARIA tabs pattern (one Tab stop, arrow keys, Home and End), a 2 px brand line under the
  open tab, a count in a small pill; they scroll sideways on a phone.
* **Roster grid:** names and hours stay in view while the days scroll; weekends on sunken; each cell
  shows the doctor or role on the first line and the start time and marks on the second; one Tab stop
  and arrow keys; a cell's spoken name starts with what it shows, then the end time, the nurse, the
  date and its marks. A line under the grid says what the selected cell holds and gives the count.
* **Day view (phones):** one day at a time with Previous day and Next day, each nurse's shift, the day's
  problems, and "To change the roster, open it on a laptop or tablet."
* **Tables:** a sunken header row with 12 px labels, rows 44 px high, row headers in bold, nothing
  wrapping; on a phone each row becomes a card.
* **Badges:** a short word with its icon on the soft colour (Waiting, Approved, Declined, Draft).
* **Forms:** the label above the field, "(optional)" after it where it applies, the hint under the
  label, the error under the field in danger with an icon, and a 2 px danger border. Errors show when
  a field is left or the form is sent; sending moves focus to the first field with an error.
* **Dialog:** title and one line of description, content that scrolls, buttons at the bottom right
  (Cancel, then the main action); on a phone it rises from the bottom. It keeps focus inside, Esc closes
  it and focus goes back to the button that opened it (`useDialogA11y`).
* **Notices:** a soft box with the icon, a bold first line and an optional action.
* **Messages (toasts):** dark, bottom right, with a Close button, read out politely (`role="status"`),
  gone after 8 seconds.

## Nurse pages (phones first)

* One column, at most 576 px wide, 16 px text.
* The next shift first, in a brand soft card, with "Add to my calendar".
* Upcoming shifts as cards: the day and its number large on the left, then the times, the doctor and
  room or the role, then the full date.
* Requests as cards with their badge and the planner's note under them.
* The main action ("Ask for leave or a day off") full width and 48 px high.

## Do not

* Grey text lighter than `ink-muted`, or any text under 12 px.
* Colour as the only signal (always an icon or a word too).
* Monospace for words, or tabular numbers in sentences.
* Colours written out in a component: use the colour roles.
* Dark mode classes (the app has a light theme only).
* Cards or buttons that move on hover; animations longer than 300 ms.
* Emoji as icons (lucide icons only, hidden from screen readers when a word is beside them).
* Dashes in visible words or ranges (a date keeps its own: DD-MM-YYYY), or dates in any other format.

## Checklist before a screen is delivered

* [ ] axe finds no serious or critical problem (`ui-audit.cjs` at 1366, 1024 and 390 px).
* [ ] No text under 12 px and no control under 24 px (44 px on touch screens).
* [ ] Nothing scrolls sideways on a phone except the roster grid inside its own box.
* [ ] Every action works with the keyboard, with the focus ring visible.
* [ ] Every mark and status has its icon or word as well as its colour.
* [ ] Dates and times follow the formats above; nothing breaks at a date's dashes.
* [ ] Words follow the owner's style (the `plain-english-reviewer`).
* [ ] Reduced motion turns movement off.
