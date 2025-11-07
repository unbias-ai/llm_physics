#!/bin/bash

set -e

echo "Verifying documentation completeness..."

# Check MOBILE_ARCHITECTURE.md exists
if [ ! -f "docs/MOBILE_ARCHITECTURE.md" ]; then
  echo "❌ docs/MOBILE_ARCHITECTURE.md missing"
  exit 1
fi

echo "✓ MOBILE_ARCHITECTURE.md exists"

# Check required sections
REQUIRED_SECTIONS=(
  "Device Detection"
  "WebGL"
  "Canvas"
  "Pyodide"
  "Performance"
  "Testing"
)

for section in "${REQUIRED_SECTIONS[@]}"; do
  if ! grep -qi "$section" docs/MOBILE_ARCHITECTURE.md; then
    echo "❌ Missing section: $section"
    exit 1
  fi
  echo "✓ Found section: $section"
done

# Check file size (should be substantial)
FILE_SIZE=$(wc -c < docs/MOBILE_ARCHITECTURE.md)
if [ "$FILE_SIZE" -lt 5000 ]; then
  echo "❌ Documentation too short ($FILE_SIZE bytes)"
  exit 1
fi

echo "✓ Documentation size: $FILE_SIZE bytes"

echo ""
echo "✅ All documentation checks passed"
