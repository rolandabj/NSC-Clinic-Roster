# NSC Clinic Roster

> Nurse rostering web app for the American Hospital Nad Al Sheba outpatient clinic in Dubai. Build rosters, check clinic rules, manage leave and requests, and send shifts to nurses.

## Overview

**NSC Clinic Roster** helps planners and nurses manage clinic shifts. Planners create rosters for a date range, fill them automatically or edit cells by hand in a spreadsheet grid, check the roster against the clinic rules, and publish shifts to nurses by email, private phone pages, and calendar feeds.

---

## Key Features

1. **Automatic Roster Engine**
   - Pairs nurses with their preferred doctors and specialties while keeping a free nurse for Nurse Clinic and blood collection at every opening hour.
   - Enforces senior nurse cover, consecutive shift limits, minimum rest between shifts, weekly hour limits, and contract hour goals.

2. **Interactive Roster Grid**
   - Spreadsheet grid with keyboard navigation, quick cell popups, undo and redo, pinned days, automatic backups before every fill or clear, and live collaboration.
   - Read only day view on phones, with full editing on laptops and tablets.

3. **Staff, Leave, and Requests**
   - Nurse and doctor directories with levels, skills, specialties, usual weekly clinics, and annual leave allowances.
   - Month leave grid for planners and self service request pages for nurses to ask for leave, a day off, or a preferred shift.

4. **Working Hours Periods and Fairness**
   - Dedicated time periods from the 19th to the 18th with cumulative hour targets and carry across published rosters.
   - Year to date balancing across weekends, public holidays, late shifts, and Nurse Clinic shifts.

5. **Publishing, Links, and Exports**
   - Google sign in and Firestore security rules for owners, planners, managers, and nurses.
   - Personal roster emails with read receipts, resumable sends, private nurse pages, live calendar feeds, and PDF, Excel, and CSV downloads.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS 4
- **Icons and Typography**: Lucide React, Google Fonts (Inter)
- **Backend**: Node.js, Express (email dispatch, calendar feeds, and Gemini insights)
- **Database and Sign In**: Google Cloud Firestore and Firebase Auth
- **Exports**: jsPDF, jsPDF AutoTable, XLSX

---

## Getting Started

### Development
```bash
npm install --legacy-peer-deps
npm run dev
```
The app runs at `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

### Running Checks
```bash
npm run lint
npm test
```
Runs the TypeScript type check and the unit test suite.

See [PROJECT_GUIDE.md](PROJECT_GUIDE.md) for the complete architecture, business rules, deployment steps, and testing workflow. Browser assets build into `dist/`; the server builds into `build/server.js` and is loaded by `npm start`.
