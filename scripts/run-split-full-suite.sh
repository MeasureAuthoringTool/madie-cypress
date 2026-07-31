#!/bin/sh

set -u

workspace=${WORKSPACE:-$(pwd)}
build_number=${BUILD_NUMBER:-local}
cd "$workspace" || exit 1

all_specs="$workspace/planned-specs-all-$build_number.txt"
service_specs="$workspace/planned-specs-service-$build_number.txt"
ui_specs="$workspace/planned-specs-ui-$build_number.txt"

reset_run_output() {
  npm run delete:reports
  rm -f "$workspace/mochawesome.json"
  rm -rf "$workspace/mochawesome-report"
  rm -rf "$workspace/runner-results"
  mkdir -p "$workspace/runner-results" "$workspace/cypress/results"
}

extract_lane() {
  lane=$1
  phase=$2
  planned=$3
  targeting=${4:-}
  label=$5

  if [ -n "$targeting" ]; then
    PLANNED_SPECS_FILE="$planned" RERUN_TARGETING_FILE="$targeting" \
      node scripts/extract-failure-details.js \
        "$workspace/failures-$lane-$phase-$build_number.txt" \
        "$workspace/failure-details-$lane-$phase-$build_number.txt" \
        "$workspace/failure-summary-$lane-$phase-$build_number.json" \
        "$label"
  else
    PLANNED_SPECS_FILE="$planned" \
      node scripts/extract-failure-details.js \
        "$workspace/failures-$lane-$phase-$build_number.txt" \
        "$workspace/failure-details-$lane-$phase-$build_number.txt" \
        "$workspace/failure-summary-$lane-$phase-$build_number.json" \
        "$label"
  fi
}

archive_lane_report() {
  lane=$1
  phase=$2
  destination="$workspace/mochawesome-$lane-$phase-$build_number.tar.gz"
  lane_results="$workspace/lane-results/$lane-$phase"

  rm -rf "$lane_results"
  mkdir -p "$lane_results"
  if ls "$workspace"/cypress/results/*.json >/dev/null 2>&1; then
    cp "$workspace"/cypress/results/*.json "$lane_results"/
    npm run combine:reports
    npm run generateOne:report
    tar -czf "$destination" -C "$workspace/mochawesome-report" .
  else
    echo "No Mochawesome JSON for $lane $phase."
    : > "$destination"
  fi
}

empty_lane_phase() {
  lane=$1
  phase=$2
  label=$3
  node scripts/merge-failure-summaries.js \
    "$workspace/failure-summary-$lane-$phase-$build_number.json" \
    "$workspace/failures-$lane-$phase-$build_number.txt" \
    "$workspace/failure-details-$lane-$phase-$build_number.txt" \
    "$label"
  : > "$workspace/mochawesome-$lane-$phase-$build_number.tar.gz"
}

merge_phase() {
  phase=$1
  standard_suffix=$2
  label=$3
  node scripts/merge-failure-summaries.js \
    "$workspace/failure-summary$standard_suffix-$build_number.json" \
    "$workspace/failures$standard_suffix-$build_number.txt" \
    "$workspace/failure-details$standard_suffix-$build_number.txt" \
    "$label" \
    "$workspace/failure-summary-service-$phase-$build_number.json" \
    "$workspace/failure-summary-ui-$phase-$build_number.json"

  bundle_dir="$workspace/lane-report-bundles/$phase"
  rm -rf "$bundle_dir"
  mkdir -p "$bundle_dir"
  cp "$workspace/mochawesome-service-$phase-$build_number.tar.gz" "$bundle_dir/service.tar.gz"
  cp "$workspace/mochawesome-ui-$phase-$build_number.tar.gz" "$bundle_dir/ui.tar.gz"
  tar -czf "$workspace/mochawesome$standard_suffix-$build_number.tar.gz" -C "$bundle_dir" .
}

run_rerun() {
  lane=$1
  phase=$2
  source_phase=$3
  label=$4
  source_failures="$workspace/failures-$lane-$source_phase-$build_number.txt"
  source_summary="$workspace/failure-summary-$lane-$source_phase-$build_number.json"
  targeting="$workspace/rerun-targeting-$lane-$phase-$build_number.json"

  if [ ! -s "$source_failures" ]; then
    echo "No $lane failures remain for $phase."
    empty_lane_phase "$lane" "$phase" "$label"
    return
  fi

  reset_run_output
  set +e
  if [ "$lane" = "service" ]; then
    CYPRESS_RERUN_THREADS=1 CYPRESS_RERUN_HEADED=false \
      node scripts/rerun-failed-tests.js "$source_summary" test "$targeting"
  else
    CYPRESS_RERUN_THREADS=3 CYPRESS_RERUN_HEADED=true \
      node scripts/rerun-failed-tests.js "$source_summary" test "$targeting"
  fi
  rerun_status=$?
  set -e
  echo "$lane $phase command status: $rerun_status"

  extract_lane "$lane" "$phase" "$source_failures" "$targeting" "$label"
  archive_lane_report "$lane" "$phase"
}

set -e

if [ -n "${SPLIT_SUITE_SPEC_FILE:-}" ]; then
  if [ ! -s "$SPLIT_SUITE_SPEC_FILE" ]; then
    echo "Split-suite spec file is missing or empty: $SPLIT_SUITE_SPEC_FILE"
    exit 1
  fi
  sed 's/\\/\//g;/^[[:space:]]*$/d' "$SPLIT_SUITE_SPEC_FILE" | sort -u > "$all_specs"
  awk '/^cypress\/e2e\/Services\//' "$all_specs" > "$service_specs"
  awk '/^cypress\/e2e\/WebInterface\//' "$all_specs" > "$ui_specs"
else
  node scripts/resolve-spec-list.js cy:parallel:test:all:tests "$all_specs"
  node scripts/resolve-spec-list.js test:all:services:tests "$service_specs"
  node scripts/resolve-spec-list.js test:opt-in:ui:parallel "$ui_specs"
fi
node scripts/validate-spec-partitions.js "$all_specs" "$service_specs" "$ui_specs"

if [ "${SPLIT_SUITE_PLAN_ONLY:-false}" = "true" ]; then
  echo 'Plan-only validation completed; Cypress lanes were not started.'
  exit 0
fi

rm -rf "$workspace/cypress/worker-artifacts" "$workspace/lane-results" "$workspace/lane-report-bundles"

echo '=== INITIAL SERVICE LANE ==='
reset_run_output
set +e
CYPRESS_PARALLEL_THREADS=1 node scripts/run-spec-list.js test cy:run:test:isolated "$service_specs"
service_status=$?
set -e
echo "Initial Service lane status: $service_status"
extract_lane service initial "$service_specs" '' 'Initial Service failures'
archive_lane_report service initial

echo '=== INITIAL WEBINTERFACE LANE ==='
reset_run_output
set +e
CYPRESS_PARALLEL_THREADS=3 node scripts/run-spec-list.js test cy:run:test:isolated "$ui_specs"
ui_status=$?
set -e
echo "Initial WebInterface lane status: $ui_status"
extract_lane ui initial "$ui_specs" '' 'Initial WebInterface failures'
archive_lane_report ui initial
merge_phase initial '' 'Initial run failures'

echo '=== LANE RERUN #1 ==='
run_rerun service rerun1 initial 'Service rerun #1 failures'
run_rerun ui rerun1 initial 'WebInterface rerun #1 failures'
merge_phase rerun1 '-rerun1' 'Rerun #1 failures'

echo '=== LANE RERUN #2 ==='
run_rerun service rerun2 rerun1 'Service rerun #2 failures'
run_rerun ui rerun2 rerun1 'WebInterface rerun #2 failures'
merge_phase rerun2 '-rerun2' 'Rerun #2 failures'

if [ -s "$workspace/failures-rerun2-$build_number.txt" ]; then
  echo 'Persistent failures remain after lane reruns.'
  exit 1
fi

echo 'Opt-in split full-suite workflow completed without persistent failures.'
