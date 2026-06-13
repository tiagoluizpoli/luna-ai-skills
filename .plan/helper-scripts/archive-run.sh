#!/usr/bin/env bash

set -euo pipefail

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly PLAN_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

usage() {
  cat <<'EOF'
Usage: archive-run.sh <run-family-id>

Archive the active execution tree for a completed run family.
EOF
}

copy_if_exists() {
  local source_path="$1"
  local destination_path="$2"

  if [[ -e "$source_path" ]]; then
    cp -R "$source_path" "$destination_path"
  fi
}

main() {
  local run_family_id="${1:-}"
  local archive_dir

  if [[ -z "$run_family_id" ]]; then
    usage >&2
    exit 1
  fi

  archive_dir="${PLAN_DIR}/archive/${run_family_id}"
  mkdir -p "$archive_dir"

  copy_if_exists "${PLAN_DIR}/index.md" "${archive_dir}/index.md"
  copy_if_exists "${PLAN_DIR}/epics" "${archive_dir}/epics"
  copy_if_exists "${PLAN_DIR}/.run-summary.md" "${archive_dir}/run-summary.md"
  copy_if_exists "${PLAN_DIR}/PRD.md" "${archive_dir}/PRD.md"

  echo "Archived run family to ${archive_dir}"
}

main "$@"
