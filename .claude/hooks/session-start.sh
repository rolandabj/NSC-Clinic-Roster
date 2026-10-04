#!/bin/bash
# Runs when a Claude Code on the web session starts: installs the app's npm
# packages and the graphify tool used by the project's /graphify skill.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# App dependencies (the flag is needed for esbuild/vite peer conflicts, as in CI)
npm install --legacy-peer-deps --no-audit --no-fund

# graphify (PyPI package "graphifyy"), installed as a uv tool into ~/.local/bin
export PATH="$HOME/.local/bin:$PATH"
if ! command -v graphify >/dev/null 2>&1; then
  if command -v uv >/dev/null 2>&1; then
    uv tool install graphifyy==0.9.73
  else
    python3 -m pip install --user graphifyy==0.9.73 || python3 -m pip install --user --break-system-packages graphifyy==0.9.73
  fi
fi
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$CLAUDE_ENV_FILE"
fi

