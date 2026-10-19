#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
source_dir="$root/.tools/gum-src"
pinned=f8ef8dad227fc1c57925ca02c0d90e60aec0d488
go_binary="${GUM_GO_BINARY:-$root/.tools/go/bin/go}"
if [[ ! -x "$go_binary" ]]; then go_binary="$(command -v go)"; fi
if [[ ! -d "$source_dir/.git" ]]; then git clone --depth 1 --branch v2.3.1 https://github.com/ehmo/gum.git "$source_dir"; fi
[[ "$(git -C "$source_dir" rev-parse HEAD)" == "$pinned" ]] || { echo 'Gum source revision differs from the audited pin' >&2; exit 1; }
patch="$root/scripts/gum/google-ads-project-access.patch"
if git -C "$source_dir" apply --check "$patch" 2>/dev/null; then
  git -C "$source_dir" apply "$patch"
else
  git -C "$source_dir" apply --reverse --check "$patch"
fi
cd "$source_dir/apps/gum"
"$go_binary" test ./internal/adapters/googleads
"$go_binary" build -trimpath -ldflags='-X main.version=2.3.1-scansignature.1' -o "$root/.tools/gum-keywords" ./cmd/gum
"$root/.tools/gum-keywords" --version
