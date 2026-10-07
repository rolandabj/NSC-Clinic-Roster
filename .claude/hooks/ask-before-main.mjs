#!/usr/bin/env node
/**
 * PreToolUse hook for Bash: a git push that would update main asks the owner first.
 * AI Studio deploys main, so a push there changes the live app. The owner approves
 * with "push to main" (CLAUDE.md); this is the safety net if a message is misread.
 */

import { execFileSync } from 'node:child_process';

let input = '';
for await (const chunk of process.stdin) input += chunk;
const { tool_input: toolInput = {}, cwd = process.cwd() } = JSON.parse(input || '{}');
const command = String(toolInput.command || '');

function currentBranch() {
  try {
    return execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

/** True when one of the command's git pushes updates main. */
function pushesMain(text) {
  for (const part of text.split(/&&|\|\||[;|\n]/)) {
    const match = part.match(/\bgit\b(?:\s+-[Cc]\s+\S+)*\s+push\b(.*)$/);
    if (!match) continue;
    const args = match[1].trim().split(/\s+/).filter(Boolean).map((a) => a.replace(/["']/g, ''));
    if (args.includes('--all') || args.includes('--mirror')) return true;
    // The first word that is not an option is the remote; the rest are refspecs.
    const words = args.filter((a) => !a.startsWith('-') && !/[<>]/.test(a));
    const refspecs = words.slice(1);
    if (refspecs.length === 0) {
      if (currentBranch() === 'main') return true;
      continue;
    }
    for (const spec of refspecs) {
      const target = spec.replace(/^\+/, '').split(':').pop();
      if (target === 'main' || target === 'refs/heads/main') return true;
      if (target === 'HEAD' && currentBranch() === 'main') return true;
    }
  }
  return false;
}

if (pushesMain(command)) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason:
          'This pushes to main, which AI Studio deploys to the live app. Allow it only if you said "push to main".',
      },
    })
  );
}
