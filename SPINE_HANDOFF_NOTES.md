
Gateway spine refactor integration pack

Runtime hierarchy:
schema -> defaults -> bridge -> tenantConfig/context -> page manifests -> SlotRenderer

Notes:
- /perks/tier1, /perks/tier2, /perks/tier3 preserved
- src/lib/tenantConfig.js remains runtime entry point
- Admin PageEditorPanel now edits tenantContent values only
- Legacy route files remain in repo but are deprecated from active routing
