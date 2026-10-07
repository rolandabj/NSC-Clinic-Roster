#!/bin/bash
# Copies the test page into _preview/ (ignored by git and the type check) and serves it
# with Vite at http://localhost:5179, then waits until it answers. Log: _preview/vite.log.
# An existing _preview/ is kept, so a changed seed.ts or main.tsx survives a restart.
set -euo pipefail
ROOT="$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel)"
cd "$ROOT"
up() { curl -s -o /dev/null -w "%{http_code}" http://localhost:5179/ 2>/dev/null | grep -q 200; }

[ -d _preview ] || cp -r .claude/skills/browser-check/harness _preview
if up; then
  echo "Already serving at http://localhost:5179/"
  exit 0
fi
(setsid nohup npx vite --config _preview/vite.config.ts --port 5179 --strictPort > _preview/vite.log 2>&1 &)
for _ in $(seq 1 60); do
  if up; then
    echo "Serving at http://localhost:5179/ (?view=schedules|doctors|availability|history|nurses|reports|dashboard)"
    exit 0
  fi
  sleep 1
done
echo "The test page did not start: see _preview/vite.log" >&2
exit 1
