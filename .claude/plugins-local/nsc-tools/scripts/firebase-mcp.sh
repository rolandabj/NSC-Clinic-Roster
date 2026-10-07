#!/bin/bash
# Starts Firebase's MCP server for this project (from the nsc-tools plugin), with
# read only tools only. The key
# is the read only service account key the owner added to the cloud environment
# settings as FIREBASE_SERVICE_ACCOUNT (the key file's JSON, or the same in base64).
# Without it the server does not start, so sessions skip the large download.
# Nothing may be written to stdout here: it carries the server's messages.
set -euo pipefail
# The repo: up from this script (the plugin lives in the repo), else the project folder.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
while [ "$ROOT" != "/" ] && [ ! -f "$ROOT/firebase-applet-config.json" ]; do ROOT="$(dirname "$ROOT")"; done
[ -f "$ROOT/firebase-applet-config.json" ] || ROOT="${CLAUDE_PROJECT_DIR:-$PWD}"
STATE="$HOME/.config/nsc-firebase"
umask 077
mkdir -p "$STATE"

if [ -z "${FIREBASE_SERVICE_ACCOUNT:-}" ]; then
  echo "Firebase is not set up: add FIREBASE_SERVICE_ACCOUNT in the cloud environment settings (PROJECT_GUIDE.md, section 14), then start a new session." >&2
  exit 1
fi
if ! node -e '
  const raw = (process.env.FIREBASE_SERVICE_ACCOUNT || "").trim();
  const json = raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
  if (!JSON.parse(json).private_key) throw new Error("no private key");
  require("fs").writeFileSync(process.argv[1], json, { mode: 0o600 });
' "$STATE/service-account.json" 2>/dev/null; then
  echo "FIREBASE_SERVICE_ACCOUNT is not a service account key (the key file's JSON, or the same in base64)." >&2
  exit 1
fi
export GOOGLE_APPLICATION_CREDENTIALS="$STATE/service-account.json"

# The project, so the server knows which one to use (the repo has no .firebaserc).
PROJECT="$(node -p "require(process.argv[1]).projectId" "$ROOT/firebase-applet-config.json")"
printf '{"projects":{"default":"%s"}}\n' "$PROJECT" > "$STATE/.firebaserc"
printf '{"firestore":{"rules":"%s/firestore.rules"}}\n' "$ROOT" > "$STATE/firebase.json"

# Read only tools: no deploy, no writes, no new projects, apps, databases or indexes.
TOOLS="firebase_get_environment,firebase_update_environment,firebase_get_project,firebase_list_apps,firebase_get_security_rules,firebase_validate_security_rules,firebase_read_resources,firestore_query_collection,firestore_get_document,firestore_list_documents,firestore_list_collections,firestore_get_database,firestore_list_databases,firestore_list_indexes,firestore_get_index"

# The session start script installs the Firebase tools in the background (about a
# minute); wait for it rather than downloading a second copy.
for _ in $(seq 1 170); do
  [ -e "$STATE/installing" ] || break
  sleep 1
done
if command -v firebase >/dev/null 2>&1; then
  exec firebase mcp --dir "$STATE" --tools "$TOOLS"
fi
exec npx -y firebase-tools@15 mcp --dir "$STATE" --tools "$TOOLS"
