#!/usr/bin/env bash

set -euo pipefail

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly PLAN_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
readonly EPICS_DIR="${PLAN_DIR}/epics"
readonly INDEX_FILE="${PLAN_DIR}/index.md"

task_status_from_file() {
  local task_file="$1"
  local ready_count=0
  local in_progress_count=0
  local blocked_count=0
  local done_count=0
  local line status

  while IFS= read -r line; do
    if [[ "$line" =~ ^status:\ (ready|in-progress|blocked|done)$ ]]; then
      status="${BASH_REMATCH[1]}"
      case "$status" in
        ready) ((ready_count+=1)) ;;
        in-progress) ((in_progress_count+=1)) ;;
        blocked) ((blocked_count+=1)) ;;
        done) ((done_count+=1)) ;;
      esac
    fi
  done < <(awk '/^## Sub-Tasks/{flag=1; next} /^---$/{flag=0} flag {print}' "$task_file")

  if ((ready_count == 0 && in_progress_count == 0 && blocked_count == 0 && done_count == 0)); then
    echo "ready"
  elif ((ready_count == 0 && in_progress_count == 0 && blocked_count == 0)); then
    echo "done"
  elif (((ready_count + in_progress_count) > 0)); then
    if ((done_count > 0 || blocked_count > 0 || in_progress_count > 0)); then
      echo "in-progress"
    else
      echo "ready"
    fi
  else
    echo "blocked"
  fi
}

main() {
  local task_file

  if [[ ! -d "$EPICS_DIR" ]]; then
    echo "No epics directory found at ${EPICS_DIR}" >&2
    exit 1
  fi

  while IFS= read -r task_file; do
    printf '%s\t%s\n' "$task_file" "$(task_status_from_file "$task_file")"
  done < <(find "$EPICS_DIR" -path '*/tasks/*.md' | sort)

  echo "Update ${INDEX_FILE} using the derived statuses above."
}

main "$@"
