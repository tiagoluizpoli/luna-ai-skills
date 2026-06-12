#!/usr/bin/env bash

set -euo pipefail

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly PLAN_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
readonly HISTORY_FILE="${PLAN_DIR}/.run-history.jsonl"
readonly SUMMARY_FILE="${PLAN_DIR}/.run-summary.md"

usage() {
  cat <<'EOF'
Usage: retrieve-history.sh [--task-id ID] [--epic-id ID] [--prd-id ID]
                           [--file PATH] [--query TEXT] [--limit N]

Return a compact history bundle from the local Ralph Loop archive surfaces.
EOF
}

main() {
  local task_id=""
  local epic_id=""
  local prd_id=""
  local file_path=""
  local query=""
  local limit="20"

  while (($# > 0)); do
    case "$1" in
      --task-id) task_id="$2"; shift 2 ;;
      --epic-id) epic_id="$2"; shift 2 ;;
      --prd-id) prd_id="$2"; shift 2 ;;
      --file) file_path="$2"; shift 2 ;;
      --query) query="$2"; shift 2 ;;
      --limit) limit="$2"; shift 2 ;;
      -h|--help) usage; exit 0 ;;
      *)
        echo "Unknown argument: $1" >&2
        usage >&2
        exit 1
        ;;
    esac
  done

  echo "# Retrieval Bundle"
  echo
  echo "## Summary"
  sed -n '1,120p' "$SUMMARY_FILE"

  echo
  echo "## Exact Match Hints"
  [[ -n "$prd_id" ]] && echo "- prd-id: ${prd_id}"
  [[ -n "$epic_id" ]] && echo "- epic-id: ${epic_id}"
  [[ -n "$task_id" ]] && echo "- task-id: ${task_id}"
  [[ -n "$file_path" ]] && echo "- file: ${file_path}"
  [[ -n "$query" ]] && echo "- query: ${query}"

  echo
  echo "## Recent Structured Events"
  if [[ -s "$HISTORY_FILE" ]]; then
    tail -n "$limit" "$HISTORY_FILE"
  else
    echo "(no structured run history yet)"
  fi

  echo
  echo "## Related Archive Hits"
  if [[ -n "$query" ]]; then
    rg -n --color=never "$query" "${PLAN_DIR}/archive" "${PLAN_DIR}/summaries" 2>/dev/null | head -n "$limit" || true
  else
    echo "(no free-text query supplied)"
  fi
}

main "$@"
