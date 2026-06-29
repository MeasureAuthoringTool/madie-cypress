#!/usr/bin/env sh

set +e

echo "=== CI diagnostics: process snapshot ==="
ps -ef | grep -E 'cypress|chrome|node|npm|cypress-parallel' | grep -v grep || true

echo "=== CI diagnostics: recent mochawesome results ==="
ls -ltr cypress/results 2>/dev/null | tail -n 40 || true

echo "=== CI diagnostics: recent runner-results ==="
ls -ltr runner-results 2>/dev/null | tail -n 40 || true

echo "=== CI diagnostics: workspace artifacts ==="
ls -ltr . 2>/dev/null | tail -n 40 || true
