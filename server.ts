/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ClinicRoster Server Bootstrap Entrypoint
 * Under Node.js ESM execution (npm run start / node server.ts):
 * - If bundled in production (build/server.js exists), imports the standalone bundle.
 * - Otherwise (in dev via tsx), imports the application source module.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const builtServer = path.resolve(__dirname, 'build', 'server.js');

if (fs.existsSync(builtServer)) {
  process.env.NODE_ENV ||= 'production';
  const builtServerPath = './build/server.js';
  await import(builtServerPath);
} else {
  await import('./server/app.ts');
}
