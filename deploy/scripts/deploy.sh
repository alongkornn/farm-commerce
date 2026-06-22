#!/usr/bin/env sh
set -eu

if [ "$#" -ne 1 ]; then
  echo "usage: $0 <container-image>" >&2
  exit 1
fi

IMAGE_TO_DEPLOY="$1"
DEPLOY_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
ENV_FILE="$DEPLOY_DIR/.env"
COMPOSE_FILE="$DEPLOY_DIR/compose.yml"
LAST_IMAGE_FILE="$DEPLOY_DIR/.last_successful_image"
PREVIOUS_IMAGE_FILE="$DEPLOY_DIR/.previous_image"

if [ ! -f "$ENV_FILE" ]; then
  echo "missing $ENV_FILE" >&2
  exit 1
fi

set -a
. "$ENV_FILE"
set +a

: "${APP_URL:?APP_URL is required in .env}"

CURRENT_IMAGE=""
if [ -f "$LAST_IMAGE_FILE" ]; then
  CURRENT_IMAGE=$(cat "$LAST_IMAGE_FILE")
fi

update_image() {
  new_image="$1"
  escaped_image=$(printf '%s' "$new_image" | sed 's/[&|]/\\&/g')
  if grep -q '^IMAGE=' "$ENV_FILE"; then
    sed -i.bak "s|^IMAGE=.*$|IMAGE=$escaped_image|" "$ENV_FILE"
    rm -f "$ENV_FILE.bak"
  else
    printf '\nIMAGE=%s\n' "$new_image" >> "$ENV_FILE"
  fi
  export IMAGE="$new_image"
}

wait_until_ready() {
  attempts=0
  while [ "$attempts" -lt 30 ]; do
    if curl --fail --silent --show-error --max-time 5 "$APP_URL/" >/dev/null; then
      return 0
    fi
    attempts=$((attempts + 1))
    sleep 5
  done
  return 1
}

cd "$DEPLOY_DIR"
update_image "$IMAGE_TO_DEPLOY"
docker compose -f "$COMPOSE_FILE" pull frontend
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

if wait_until_ready; then
  if [ -n "$CURRENT_IMAGE" ] && [ "$CURRENT_IMAGE" != "$IMAGE_TO_DEPLOY" ]; then
    printf '%s\n' "$CURRENT_IMAGE" > "$PREVIOUS_IMAGE_FILE"
  fi
  printf '%s\n' "$IMAGE_TO_DEPLOY" > "$LAST_IMAGE_FILE"
  docker image prune -f >/dev/null
  echo "deployment succeeded: $IMAGE_TO_DEPLOY"
  exit 0
fi

echo "deployment health check failed" >&2
docker compose -f "$COMPOSE_FILE" logs --tail=200 frontend >&2

if [ -n "$CURRENT_IMAGE" ] && [ "$CURRENT_IMAGE" != "$IMAGE_TO_DEPLOY" ]; then
  echo "rolling back to $CURRENT_IMAGE" >&2
  update_image "$CURRENT_IMAGE"
  docker compose -f "$COMPOSE_FILE" pull frontend
  docker compose -f "$COMPOSE_FILE" up -d --remove-orphans
  wait_until_ready || echo "rollback health check failed" >&2
fi

exit 1
