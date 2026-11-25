#!/bin/bash
# Render every promo scene (bg + transparent fg layer) to promo/build/*.png with headless Chrome.
# Needs the site served locally: python3 -m http.server 8765
set -e
cd "$(dirname "$0")"
CH="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
URL="${BASE:-http://localhost:8765}/promo/card.html"
PROFILE="$(mktemp -d)"
mkdir -p build
shot(){ # $1=query $2=out $3=transparent?
  local bgc=(); [ "$3" = t ] && bgc=(--default-background-color=00000000)
  "$CH" --headless=new --user-data-dir="$PROFILE" --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=1920,1080 --virtual-time-budget=6000 "${bgc[@]}" --screenshot="build/$2.png" "$URL?$1" 2>/dev/null
}
for s in epi logo outro; do shot "scene=$s&layer=bg" "$s-bg"; shot "scene=$s&layer=fg" "$s-fg" t; done
for i in $(seq 0 9); do shot "scene=char&i=$i&layer=bg" "c$i-bg"; shot "scene=char&i=$i&layer=fg" "c$i-fg" t; done
rm -rf "$PROFILE"
echo "rendered $(ls build/*.png | wc -l) layers"
