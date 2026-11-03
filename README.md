# NSC Clinic Roster

> Nurse rosters for an outpatient clinic: made around the doctors' clinics and the nurses' leave, checked against the clinic's rules, and sent to each nurse.

## What it does

- **Rosters.** Fill a roster for two weeks or a month. Each doctor's clinic gets its nurses, each nurse's leave, days off and pinned days are kept, and the hours go towards each nurse's goal. Change any shift by hand; the roster is checked again at once, and each problem is named with what to do about it.
- **Hours.** Every nurse has a goal for each time period, worked out from their contract. Hours ahead or short carry into the next roster, within limits that protect nurses from overwork.
- **Leave and requests.** Nurses ask for leave, days off and shifts; planners and managers approve or decline them, and the nurse gets an email.
- **Publishing.** Publish a roster to email each nurse their shifts, with a private link to their own roster and a public link to the whole one. History keeps every published version and saved copy.
- **Reports and audit.** Hours against each nurse's goal, how fairly weekends and late finishes were shared, leave allowances, and who changed what.
- **Access.** People sign in with Google. The owner approves each account and decides who can change rosters and who can only look.

## Built with

- React 19, TypeScript, Vite and Tailwind CSS, with the Inter font and Lucide icons
- Node.js and Express for the email and sign in server
- Google Cloud Firestore and Firebase Auth
- jsPDF and XLSX for PDF and Excel files

## Getting started

### Development

```bash
npm install --legacy-peer-deps
npm run dev
```

The app opens at `http://localhost:3000`.

### Production build

```bash
npm run build
npm start
```

### Tests

```bash
npm test
```

Runs the unit tests of the roster engine, the roster check, hours, leave, publishing and the screens' logic.

See [PROJECT_GUIDE.md](PROJECT_GUIDE.md) for how the app is built, deployed and tested. The browser files build into `dist/`; the server builds into `build/server.js`, which `npm start` loads.
