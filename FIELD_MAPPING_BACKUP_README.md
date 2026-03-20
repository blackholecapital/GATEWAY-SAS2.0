# Field Mapping Backup Contract

This repository includes a checked-in mapping contract to safely restore data from
`demo-generator-3.0-claude-restore-letter-markers-EYSuA` onto the
`demo-generator-3.0-main` schema.

## Files

- `field-map.json`: canonical restore-to-main translation map.
- `copy-field-map.spec.js`: helper implementation for same-path copy + explicit map application.
- `factory-field-backup.json`: canonical list of all `FactoryPage` field paths plus a seeded `targetData` snapshot where every path resolves.
- `src/__tests__/factoryContract.test.js`: contract tests that fail if any `FactoryPage` field path is unresolved or if the backup drifts from `FactoryPage`.

## Mapping Rules

1. Copy values source -> target for every rendered field path under `samePathPrefixes` when the source path exists.
2. Apply all `explicitMap` entries (`oldPath -> newPath`).
3. Preserve all `targetOnlyPaths` in main (do not overwrite during automated restore unless manually instructed).
4. Fail if any `FactoryPage` field path resolves to `undefined` in the target output.

## Agent Handoff

Use `field-map.json` as the canonical translation layer from restore -> main, copy same-path fields directly, apply `explicitMap` old->new, preserve target-only paths, then fail build if any `FactoryPage` path is unresolved.
