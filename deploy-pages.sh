#!/usr/bin/env bash
# Deploy JICON Construction site to GitHub Pages (homeplacer org).
# Mirrors the pattern used by the other Forturro/Home Placer friend sites.
set -euo pipefail
cd "$(dirname "$0")"

REPO="homeplacer/jicon-website"

# .nojekyll so GitHub Pages serves /assets untouched
touch .nojekyll

if [ ! -d .git ]; then
  git init -b main
fi
git add -A
git commit -m "Rebuild JICON Construction site (modern static, real brand assets)" || echo "nothing to commit"

if ! gh repo view "$REPO" >/dev/null 2>&1; then
  gh repo create "$REPO" --public --source=. --remote=origin --push
else
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$REPO.git"
  git push -u origin main
fi

# Enable Pages from main / root (idempotent)
gh api -X POST "repos/$REPO/pages" -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 \
  || gh api -X PUT "repos/$REPO/pages" -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 \
  || true

echo "Done → https://homeplacer.github.io/jicon-website/"
