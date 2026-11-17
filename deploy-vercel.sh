#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  BANCACTIU 2.0 - AUTOMATED VERCEL PRODUCTION DEPLOYMENT   "
echo "=========================================================="

if ! command -v vercel &> /dev/null; then
    echo "ERROR: Vercel CLI is not installed. Run: npm install -g vercel"
    exit 1
fi

if vercel whoami 2>&1 | grep -q "Logged out"; then
    echo "WARNING: Not logged in to Vercel CLI. Run: vercel login"
    exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

APPS=(
  "apps/bancactiu-nexus:bancactiu-nexus"
  "apps/bancactiu-salut:bancactiu-salut"
  "apps/bancactiu-municipal:bancactiu-municipal"
  "apps/bancactiu-social:bancactiu-social"
  "apps/bancactiu-operatiu-1.0:bancactiu-operatiu"
)

for ENTRY in "${APPS[@]}"; do
  APP_PATH="${ENTRY%%:*}"
  PROJECT_NAME="${ENTRY##*:}"
  
  echo ""
  echo "----------------------------------------------------------"
  echo ">>> Deploying $PROJECT_NAME from $APP_PATH..."
  echo "----------------------------------------------------------"
  
  cd "$ROOT_DIR/$APP_PATH"
  vercel link --project "$PROJECT_NAME" --yes
  vercel --prod --yes
done

echo ""
echo "=========================================================="
echo "  ALL MICRO-APPS DEPLOYED SUCCESSFULLY TO VERCEL!         "
echo "=========================================================="
