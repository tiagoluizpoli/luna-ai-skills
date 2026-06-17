#!/usr/bin/env bash
# Hardened for ST-02 update-state contract verification (iteration 5)

set -euo pipefail

readonly REPO_OWNER="tiagoluizpoli"
readonly REPO_NAME="luna-ai-skills"
readonly REPO_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}"

show_help() {
  cat <<'EOF'
Usage: install.sh [--yes --agents hermes,codex,agy --availability local|global] [--force]

Interactive mode asks only two questions in this order:
1. Which install agents should receive the Ralph Loop framework?
2. Which availability mode should this run use?

Notes:
- All framework skills are mandatory in v1.
- Legacy flags --targets, --bundles, --skills, and --all are no longer supported.
- Non-interactive runs must pass both --agents and --availability.
EOF
}

require_command() {
  local command_name="$1"
  local help_text="$2"

  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Missing required command: ${command_name}" >&2
    echo "${help_text}" >&2
    exit 1
  fi
}

resolve_repo_root() {
  if ! git rev-parse --show-toplevel >/dev/null 2>&1; then
    echo "This installer must run inside a Git repository." >&2
    exit 1
  fi

  git rev-parse --show-toplevel
}

resolve_default_branch() {
  local auth_header=()
  if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    auth_header=(-H "Authorization: token ${GITHUB_TOKEN}")
  fi

  curl -fsSL "${auth_header[@]}" "https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}" \
    | node -e 'let data="";process.stdin.on("data",d=>data+=d);process.stdin.on("end",()=>{const json=JSON.parse(data);process.stdout.write(json.default_branch || "main");});'
}

resolve_commit_sha() {
  local ref_name="$1"
  local auth_header=()
  if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    auth_header=(-H "Authorization: token ${GITHUB_TOKEN}")
  fi

  curl -fsSL "${auth_header[@]}" "https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits/${ref_name}" \
    | node -e 'let data="";process.stdin.on("data",d=>data+=d);process.stdin.on("end",()=>{const json=JSON.parse(data);process.stdout.write(json.sha || "");});'
}

main() {
  local repo_root temp_dir ref_name commit_sha tarball_url extracted_root installer_dir

  if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    show_help
    exit 0
  fi

  require_command git "Install Git and rerun the installer."
  require_command curl "Install curl or fetch the installer manually from ${REPO_URL}."
  require_command node "Install Node.js and rerun the installer."
  require_command npm "Install npm and rerun the installer."
  require_command tar "Install tar and rerun the installer."

  repo_root="$(resolve_repo_root)"
  temp_dir="$(mktemp -d /tmp/ralph-loop-installer.XXXXXX)"
  trap "rm -rf '${temp_dir}'" EXIT

  ref_name="$(resolve_default_branch)"
  commit_sha="$(resolve_commit_sha "${ref_name}")"

  local auth_header=()
  if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    auth_header=(-H "Authorization: token ${GITHUB_TOKEN}")
    tarball_url="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/tarball/${commit_sha}"
  else
    tarball_url="https://codeload.github.com/${REPO_OWNER}/${REPO_NAME}/tar.gz/${commit_sha}"
  fi

  curl -fsSL "${auth_header[@]}" "${tarball_url}" -o "${temp_dir}/framework.tar.gz"
  tar -xzf "${temp_dir}/framework.tar.gz" -C "${temp_dir}"

  extracted_root="$(find "${temp_dir}" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
  installer_dir="${extracted_root}/frameworks/ralph-loop/installer"

  npm install --prefix "${installer_dir}" >/dev/null

  if [ -t 2 ] && [ -c /dev/tty ]; then
    node "${installer_dir}/src/index.mjs" \
      --source-root "${extracted_root}" \
      --target-root "${repo_root}" \
      --repo-url "${REPO_URL}" \
      --ref "${ref_name}" \
      --sha "${commit_sha}" \
      "$@" </dev/tty
  else
    node "${installer_dir}/src/index.mjs" \
      --source-root "${extracted_root}" \
      --target-root "${repo_root}" \
      --repo-url "${REPO_URL}" \
      --ref "${ref_name}" \
      --sha "${commit_sha}" \
      "$@"
  fi
}

main "$@"
