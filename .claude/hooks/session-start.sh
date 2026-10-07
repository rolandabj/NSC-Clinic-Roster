#!/bin/bash
# Runs when a Claude Code on the web session starts: has git fetch GitHub over
# HTTPS, starts the Firebase tools download when the Firebase key is set, and
# installs the app's npm packages and the graphify tool used by the project's
# /graphify skill.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# GitHub addresses written for SSH (git@github.com:owner/repo) are fetched over
# HTTPS: cloud sessions have no SSH keys. Setting it again is harmless.
git config --global url."https://github.com/".insteadOf git@github.com:

# Firebase's tools, for the read only Firebase server (.mcp.json and
# .claude/scripts/firebase-mcp.sh): only once the owner has added the key
# FIREBASE_SERVICE_ACCOUNT to the cloud environment. The download is large (about a
# minute), so it runs in the background and the server waits for it.
if [ -n "${FIREBASE_SERVICE_ACCOUNT:-}" ] && ! command -v firebase >/dev/null 2>&1; then
  FIREBASE_STATE="$HOME/.config/nsc-firebase"
  mkdir -p "$FIREBASE_STATE"
  touch "$FIREBASE_STATE/installing"
  (setsid nohup bash -c 'npm install -g firebase-tools@15 --no-audit --no-fund; rm -f "$1"' _ "$FIREBASE_STATE/installing" > "$FIREBASE_STATE/install.log" 2>&1 &)
fi

# App dependencies (the flag is needed for esbuild/vite peer conflicts, as in CI)
npm install --legacy-peer-deps --no-audit --no-fund --no-package-lock

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

