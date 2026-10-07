#!/usr/bin/env node
/**
 * PreToolUse hook for Bash: refuses a git commit that changes anything besides
 * PROJECT_GUIDE.md and graphify-out/ without changing PROJECT_GUIDE.md too. The
 * owner's standing rule (CLAUDE.md): every change updates the guide in the same
 * commit, and the graph is refreshed. A merge commit is let through.
 */

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

let input = '';
for await (const chunk of process.stdin) input += chunk;
const { tool_input: toolInput = {}, cwd = process.cwd() } = JSON.parse(input || '{}');
const command = String(toolInput.command || '');
if (!/\bgit\b[^\n;&|]*\bcommit\b/.test(command)) process.exit(0);

const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8' });
const lines = (text) => text.split('\n').map((l) => l.trim()).filter(Boolean);
let top;
try {
  top = git('rev-parse', '--show-toplevel').trim();
} catch {
  process.exit(0);
}
if (existsSync(join(top, '.git', 'MERGE_HEAD'))) process.exit(0);

// What the commit would hold: what is staged, plus every change when the command
// stages files itself first (git add, or git commit -a).
const files = new Set(lines(git('diff', '--cached', '--name-only')));
const stagesItself = /\bgit\s+add\b/.test(command) || /\bcommit\b[^\n;&|]*\s(-[a-zA-Z]*a[a-zA-Z]*|--all)(\s|$)/.test(command);
if (stagesItself) {
  // Not trimmed: each line starts with two status columns (" M path"), then the path.
  for (const line of git('status', '--porcelain', '--untracked-files=all').split('\n').filter(Boolean)) {
    files.add(line.slice(3).split(' -> ').pop().replace(/^"|"$/g, ''));
  }
}

const others = [...files].filter((f) => f !== 'PROJECT_GUIDE.md' && !f.startsWith('graphify-out/'));
if (others.length > 0 && !files.has('PROJECT_GUIDE.md')) {
  const shown = others.slice(0, 3).join(', ') + (others.length > 3 ? ` and ${others.length - 3} more` : '');
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason:
          `This commit changes ${shown} but not PROJECT_GUIDE.md. The owner's rule (CLAUDE.md): update ` +
          'PROJECT_GUIDE.md in the same commit (the sections touched, the test count, a history item in ' +
          'section 16 and the Last updated line), then run graphify update . and stage graphify-out/.',
      },
    })
  );
}
