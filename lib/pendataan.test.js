import test from 'node:test';
import assert from 'node:assert/strict';

import { pendataanSections, summarizePendataan } from './pendataan.js';

test('pendataan sections include ibu hamil, KB, and imunisasi', () => {
  const ids = pendataanSections.map((section) => section.id);

  assert.deepEqual(ids, ['ibu-hamil', 'kb', 'imunisasi']);
});

test('summary groups entries by category and status', () => {
  const summary = summarizePendataan([
    { category: 'ibu-hamil', status: 'aktif', date: '2026-10-01' },
    { category: 'kb', status: 'aktif', date: '2026-10-05' },
    { category: 'kb', status: 'monitoring', date: '2026-10-06' },
  ]);

  assert.equal(summary.total, 3);
  assert.equal(summary.byCategory['ibu-hamil'], 1);
  assert.equal(summary.byCategory.kb, 2);
  assert.equal(summary.byStatus.aktif, 2);
  assert.equal(summary.byStatus.monitoring, 1);
});
