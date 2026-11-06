library MAT10666ExpectedActualEpisodeResults version '0.0.000'

using USQualityCore version '0.5.0'

include hl7.fhir.uv.cql.FHIRHelpers version '4.0.1' called FHIRHelpers

parameter "Measurement Period" Interval<DateTime>

context Patient

// This self-contained fixture reproduces the episode-result shape from the
// supplied NHSN HOB draft without requiring its unpublished dependency libraries.
define "MAT-10666 HOB Encounter Result":
  [USQualityCore.Encounter]

define "MAT-10666 No Encounter Result":
  [USQualityCore.Encounter] E
    where false

define function "MAT-10666 Observation"(encounter USQualityCore.Encounter):
  duration in days of FHIRHelpers.ToInterval(encounter.period)
