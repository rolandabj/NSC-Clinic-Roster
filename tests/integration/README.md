# Schedule transaction checks

This test runs the real Firestore repository against the local Firestore emulator with the repository rules. It uses a demo project and does not contact the clinic database.

Install the existing emulator dependencies:

```sh
npm install --prefix tests/firestore-rules --legacy-peer-deps --no-package-lock
```

Run from the repository root (Java 17 or newer):

```sh
npm exec --yes --package=firebase-tools@14.12.0 -- firebase emulators:exec --config firebase.emulator.json --only firestore --project demo-roster 'node --import tsx tests/integration/scheduleTransactions.test.ts'
```

Checks include two simultaneous planner saves, migration of existing roster dates into the calendar index, publishing metadata, date edits, conflicting imports with no partial writes, deleting and reusing dates, and ignoring a stale calendar index in a backup restore.

# Email server routing checks

After building, verify all supported startup paths without sending mail or accessing production data:

```sh
npm run build
node --import tsx tests/integration/emailServer.test.ts
```

Covers Express development, built production, direct Vite and Vite preview. Each must serve the web app and the protected email API together, return JSON for API errors and refuse downloads of the server bundle.
