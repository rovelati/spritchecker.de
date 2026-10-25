#!/bin/bash
# rebuild-and-deploy-vps.sh — SpritChecker.de
# Eseguito 2 volte al giorno via crontab sul server Contabo VPS
set -euo pipefail

LOG="/var/log/spritchecker-rebuild.log"
APP_DIR="/var/www/spritchecker.de"
CF_PROJECT="spritchecker"

export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"
if [ -d "${HOME:-/root}/.nvm" ]; then
  export NVM_DIR="${HOME:-/root}/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG"; }

log "============================================================"
log "Starting SpritChecker.de Daily Ingestion & Cloudflare Deploy..."

cd "$APP_DIR"

# 1. Aggiorna codice da GitHub
if [ -d .git ]; then
  log "Fetching latest code from GitHub..."
  git fetch origin main
  git reset --hard origin/main
fi

# 2. Installa dipendenze se necessario
if [ ! -d "node_modules" ]; then
  log "Installing npm dependencies..."
  npm install --legacy-peer-deps 2>&1 | tee -a "$LOG"
fi

# 3. Build Astro SSG (12.007 pagine statiche)
log "Building Astro static site (3.000 Städte x Kraftstoffe)..."
NODE_OPTIONS="--max-old-space-size=4096" npm run build 2>&1 | tee -a "$LOG"

# 4. Deploy Cloudflare Pages
log "Deploying to Cloudflare Pages project=$CF_PROJECT ..."
export CLOUDFLARE_API_KEY="${CLOUDFLARE_API_KEY:-9578b8b72ddb8947067606c42533c784203b6}"
export CLOUDFLARE_EMAIL="${CLOUDFLARE_EMAIL:-romolo.velati@gmail.com}"
export CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-383050c9ba92a1ab1144bc18d44f586c}"

npx --yes wrangler@4 pages deploy dist \
  --project-name="$CF_PROJECT" \
  --branch=main \
  --commit-dirty=true 2>&1 | tee -a "$LOG"

# 5. Notifica IndexNow a Bing, Yandex, Seznam
log "Pinging IndexNow for Bing & search engines..."
node scripts/notify-indexnow.js 2>&1 | tee -a "$LOG" || true

log "SpritChecker.de Rebuild & Deploy SUCCESS!"
log "============================================================"
