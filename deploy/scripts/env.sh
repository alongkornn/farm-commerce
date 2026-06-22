#!/usr/bin/env sh

read_env() {
  key="$1"
  file="$2"
  value=$(sed -n "s/^${key}=//p" "$file" | tail -n 1 | tr -d '\r')

  case "$value" in
    \'*\')
      value=${value#\'}
      value=${value%\'}
      ;;
    \"*\")
      value=${value#\"}
      value=${value%\"}
      ;;
  esac

  printf '%s' "$value"
}

require_env() {
  key="$1"
  file="$2"
  value=$(read_env "$key" "$file")
  if [ -z "$value" ]; then
    echo "$key is required in $file" >&2
    exit 1
  fi
  printf '%s' "$value"
}
