import { describe, expect, it } from 'vitest';
import backup from './factory-field-backup.json' assert { type: 'json' };

export function getByPath(obj, path) {
  return path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

export function setByPath(obj, path, value) {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
  let ref = obj;

  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i];
    const nextKey = parts[i + 1];
    const nextIsIndex = /^\d+$/.test(nextKey);

    if (ref[key] == null) {
      ref[key] = nextIsIndex ? [] : {};
    }
    ref = ref[key];
  }

  ref[parts[parts.length - 1]] = value;
}

export function copySamePathPrefixes(sourceData, targetData, samePathPrefixes, canonicalFieldPaths = backup.fieldPaths) {
  for (const fieldPath of canonicalFieldPaths) {
    if (!samePathPrefixes.some((prefix) => fieldPath.startsWith(prefix))) {
      continue;
    }

    const value = getByPath(sourceData, fieldPath);
    if (value !== undefined) {
      setByPath(targetData, fieldPath, value);
    }
  }

  return targetData;
}

export function applyExplicitMap(sourceData, targetData, explicitMap) {
  for (const [sourcePath, targetPath] of Object.entries(explicitMap)) {
    const value = getByPath(sourceData, sourcePath);
    if (value !== undefined) {
      setByPath(targetData, targetPath, value);
    }
  }
  return targetData;
}

export function preserveTargetOnly(targetData) {
  return targetData;
}

export function applyFieldMap({ sourceData, targetData, fieldMap, canonicalFieldPaths = backup.fieldPaths }) {
  copySamePathPrefixes(sourceData, targetData, fieldMap.samePathPrefixes, canonicalFieldPaths);
  applyExplicitMap(sourceData, targetData, fieldMap.explicitMap);
  preserveTargetOnly(targetData, fieldMap.targetOnlyPaths);
  return targetData;
}

describe('copy-field-map helpers', () => {
  it('copies same-path values using canonical field paths', () => {
    const source = { pages: { gate: { hero: { title: 'From source' } } } };
    const target = { pages: { gate: { hero: { title: 'From target' } } } };
    const out = copySamePathPrefixes(source, target, ['pages.gate'], ['pages.gate.hero.title']);
    expect(out.pages.gate.hero.title).toBe('From source');
  });

  it('applies explicit old->new path translations', () => {
    const source = { pages: { vip: { hero: { body: 'Legacy body' } } } };
    const target = { pages: { vip: { hero: { subtitle: '' } } } };
    const out = applyExplicitMap(source, target, { 'pages.vip.hero.body': 'pages.vip.hero.subtitle' });
    expect(out.pages.vip.hero.subtitle).toBe('Legacy body');
  });
});
