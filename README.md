# ClinicRoster

> Outpatient clinic nursing roster and shift scheduling web application with deterministic nurse-to-doctor pairing, leave & locked day enforcement, and an Excel-like workbook.

## Overview

**ClinicRoster** is a web-based clinical workforce management system designed for outpatient clinics, specialty centers, and healthcare departments. It automates complex scheduling constraints, balances contract hours, preserves strict doctor-nurse pairing continuity, and supports real-time roster publishing, export, and verification.

---

## Key Features

1. **Deterministic Scheduling Engine**
   - Automatically generates conflict-free duty schedules respecting physician assignments, working hour limits, contract targets, and fairness quotas.
   - Prevents consecutive duty violations, enforces minimum rest periods, and manages float nurse allocations.

2. **Excel-Like Roster Workbook**
   - Interactive scheduling grid with live formula updates, shift badges, undo/redo history, and instant problem diagnostics.
   - Supports keyboard navigation, inline cell editing, and status validation.

3. **Multi-Staff & Availability Management**
   - Nurse and doctor directory with seniority levels, clinical roles, specialty credentials, and custom shift preferences.
   - Dedicated leave tracking (Annual, Sick, Maternity, Study, Compassionate) and locked day-off constraints.

4. **Dedicated Working Hours Periods**
   - Period-based contract target tracking with automated daily-rate prorating for shorter schedule ranges.
   - Year-to-date duty balancing across weekends, public holidays, and night rotations.

5. **Role-Based Access & Publishing**
   - Granular permissions with Google Authentication and Firestore persistence.
   - Public read-only roster views, individualized nurse rosters, PDF/Excel export, and automated notification workflows.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Icons & Typography**: Lucide React, Google Fonts (Plus Jakarta Sans, JetBrains Mono)
- **Backend**: Node.js, Express (dual SPA & REST middleware mode)
- **Database & Auth**: Google Cloud Firestore & Firebase Auth
- **Reporting & Export**: jsPDF, jsPDF-AutoTable, XLSX

---

## Getting Started

### Development
```bash
npm install --legacy-peer-deps
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

### Running Tests
```bash
npm run test
```
Runs the full suite of unit tests validating the scheduling engine, cascade deletions, period calculations, and constraints.

See [PROJECT_GUIDE.md](PROJECT_GUIDE.md) for architecture, deployment, security, and the full testing workflow. Browser assets build into `dist/`; the backend builds separately into `build/server.js` and is loaded by `npm start`.
