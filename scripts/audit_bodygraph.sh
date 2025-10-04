#!/usr/bin/env bash
set -Eeuo pipefail
TS="$(date +%Y-%m-%d_%H-%M-%S)"; OUT="reports/audit_$TS"; mkdir -p "$OUT"

{ echo "=== SYSTEM ==="; uname -a || true; sw_vers 2>/dev/null || true;
  echo; echo "=== TOOLS ===";
  which node && node -v || true; which npm && npm -v || true;
  which pnpm && pnpm -v || true; which yarn && yarn -v || true;
} > "$OUT/system.txt"

[ -f package.json ] && {
  (jq '.' package.json || cat package.json) > "$OUT/package.json" 2>/dev/null;
  (jq '.name,.version,.scripts,.dependencies,.devDependencies' package.json || true) > "$OUT/pkg_summary.txt" 2>/dev/null;
}

for f in tsconfig.json next.config.* .env .env.local .env.development .env.production; do
  [ -f "$f" ] && { echo "### $f" >> "$OUT/configs.txt"; sed -n '1,200p' "$f" >> "$OUT/configs.txt"; echo >> "$OUT/configs.txt"; }
done

if command -v tree >/dev/null 2>&1; then
  tree -a -I 'node_modules|.git|.next|dist|build|out' -L 3 > "$OUT/tree.txt"
else
  find . -maxdepth 3 -type d \( -name node_modules -o -name .git -o -name .next -o -name dist -o -name build -o -name out \) -prune -o -print > "$OUT/tree.txt"
fi

{ echo "=== ROUTES ===";
  [ -d app ] && { echo "-- app/"; find app -type f \( -name 'page.*' -o -name 'route.*' -o -name 'layout.*' \) | sort; }
  [ -d pages ] && { echo "-- pages/"; find pages -type f \( -name '*.tsx' -o -name '*.ts' -o -name '*.jsx' -o -name '*.js' \) | sort; }
} > "$OUT/routes.txt"

grep -Rin --include='*.{ts,tsx,js,jsx}' -E 'I18nProvider|ThemeProvider|Web3|wagmi|viem|@tanstack/react-query|zxing|BarcodeDetector|TabBar|/settings/(language|security)|/scan|/profile|/home' . 2>/dev/null | head -n 500 > "$OUT/grep_features.txt" || true

{ echo "=== git status ==="; git status 2>&1 || true; echo;
  echo "=== git remotes ==="; git remote -v 2>/dev/null || true; echo;
  echo "=== .gitignore ==="; [ -f .gitignore ] && sed -n '1,200p' .gitignore || echo "no .gitignore";
} > "$OUT/git.txt"

{ echo "=== PORTS 3010/5678 ===";
  (lsof -iTCP -sTCP:LISTEN -nP 2>/dev/null | grep -E ':3010|:5678') || echo "no listeners";
} > "$OUT/ports.txt"

grep -Rin --include='*.{ts,tsx,js,jsx}' -E "Can't resolve|Module not found|<<<<<<< HEAD|>>>>>>> |Merge conflict marker" . 2>/dev/null > "$OUT/errors_grep.txt" || true

echo "OK -> $OUT"
