#!/bin/bash
# Stops the test page's Vite server and deletes _preview/ (never commit it).
# There is no ss or lsof here, so the server is found through /proc.
set -uo pipefail
ROOT="$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel)"
for p in /proc/[0-9]*; do
  cmd=$(tr '\0' ' ' < "$p/cmdline" 2>/dev/null) || continue
  case "$cmd" in
    *"vite --config _preview/vite.config.ts"*) kill -9 "${p#/proc/}" 2>/dev/null && echo "Stopped ${p#/proc/}" ;;
  esac
done
rm -rf "$ROOT/_preview"
echo "_preview/ removed"
