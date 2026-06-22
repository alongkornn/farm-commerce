#!/usr/bin/env sh
set -eu

DEPLOY_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
PREVIOUS_IMAGE_FILE="$DEPLOY_DIR/.previous_image"

if [ ! -s "$PREVIOUS_IMAGE_FILE" ]; then
  echo "no previous image available" >&2
  exit 1
fi

"$DEPLOY_DIR/scripts/deploy.sh" "$(cat "$PREVIOUS_IMAGE_FILE")"
