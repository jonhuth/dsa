#!/usr/bin/env bash
#
# Validate that every bun.lock in the repo is in sync with its package.json.
#
# Why this exists: a stale web/bun.lock silently broke every Railway deploy for
# ~4 months. Railway sets CI=true, which makes bun default to --frozen-lockfile,
# so drift only ever surfaced as a failed deploy. CI ran `bun install --no-save`,
# which neither validates nor updates the lockfile, so it could not catch it.
#
# This mirrors the intent of .githooks/pre-commit, which performs the same check
# locally across all lockfiles (not just the root one).
set -uo pipefail

ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

fail=0
found=0

while IFS= read -r lock; do
  found=1
  dir=$(dirname "$lock")
  echo "::group::bun install --frozen-lockfile --dry-run ($dir)"
  if bun install --frozen-lockfile --dry-run --cwd "$dir"; then
    echo "✅ $lock is in sync"
  else
    echo "::error file=$lock::$lock is out of sync with $dir/package.json. Run 'bun install' in $dir/ and commit the updated lockfile."
    fail=1
  fi
  echo "::endgroup::"
done < <(find . -name bun.lock -not -path '*/node_modules/*' -not -path '*/.next/*')

if [ "$found" -eq 0 ]; then
  echo "::error::No bun.lock files found — the check would pass vacuously. Refusing."
  exit 1
fi

exit "$fail"
