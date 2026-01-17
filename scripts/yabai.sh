#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

app_echonote=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --app-echonote)
      app_echonote="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

if [[ -n "$app_echonote" ]]; then
  "$SCRIPT_DIR/yabai_impl.sh" --bundle-id "$app_echonote" --position left
fi
