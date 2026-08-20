#!/bin/bash
# Publish a signed+notarised Dumont Chat desktop release to dumont.au.
#
# Serves each build under THREE names, all required:
#   DumontChat-<v>-{arm64,intel}.dmg        the human download
#   DumontChat-latest-{arm64,intel}.dmg     the stable links we hand out
#   <v>/DumontChat-<v>-mac-{arm64,x64}.dmg  what the in-app updater fetches
# The old brand appears in no served path. Installs older than 6.2.5 have the
# legacy URL compiled in and will 404 on their update button; they need one
# manual download from the latest- link, after which they self-update.
#
# Usage: publish-desktop.sh <version>
set -euo pipefail
V="${1:?usage: publish-desktop.sh <version>}"
REL="$HOME/Airspace/repos/dumont-chat-desktop/release/$V"
HOST=airbase-hel1
D=/opt/dumont-website/desktop

[ -f "$REL/Dumont Chat-$V-arm64.dmg" ] || { echo "missing arm64 dmg for $V"; exit 1; }
[ -f "$REL/Dumont Chat-$V-x64.dmg" ]   || { echo "missing x64 dmg for $V"; exit 1; }

cp "$REL/Dumont Chat-$V-arm64.dmg" "/tmp/DumontChat-$V-arm64.dmg"
cp "$REL/Dumont Chat-$V-x64.dmg"   "/tmp/DumontChat-$V-intel.dmg"
scp -q "/tmp/DumontChat-$V-arm64.dmg" "/tmp/DumontChat-$V-intel.dmg" "$HOST:/tmp/"

ssh "$HOST" "set -e
sudo mv /tmp/DumontChat-$V-arm64.dmg /tmp/DumontChat-$V-intel.dmg $D/
sudo chmod 644 $D/DumontChat-$V-*.dmg
sudo ln -sfn DumontChat-$V-arm64.dmg $D/DumontChat-latest-arm64.dmg
sudo ln -sfn DumontChat-$V-intel.dmg $D/DumontChat-latest-intel.dmg
sudo mkdir -p $D/$V
sudo ln -sfn ../DumontChat-$V-arm64.dmg $D/$V/DumontChat-$V-mac-arm64.dmg
sudo ln -sfn ../DumontChat-$V-intel.dmg $D/$V/DumontChat-$V-mac-x64.dmg
printf '%s' '$V' | sudo tee $D/latest.txt > /dev/null
"
rm -f "/tmp/DumontChat-$V-arm64.dmg" "/tmp/DumontChat-$V-intel.dmg"

echo "=== published, verifying every URL the app or a human can hit"
for u in "DumontChat-latest-arm64.dmg" "DumontChat-latest-intel.dmg" \
         "$V/DumontChat-$V-mac-arm64.dmg" "$V/DumontChat-$V-mac-x64.dmg"; do
    printf '  %-46s ' "$u"
    curl -sI -A dumont-agent "https://dumont.au/desktop/$u" | head -1 | tr -d '\r'
done
printf '  %-46s ' "latest.txt"; curl -s -A dumont-agent https://dumont.au/desktop/latest.txt; echo
