import test from 'node:test';
import assert from 'node:assert/strict';

import { hasilKegiatanSections, summarizeHasilKegiatan } from './hasil-kegiatan.js';

test('field activity sections include required posyandu categories', () => {
  const ids = hasilKegiatanSections.map((section) => section.id);

  assert.deepEqual(ids, [
    'kesehatan-ibu-anak',
    'gizi',
    'pencegahan-diare',
    'kb',
    'imunisasi',
  ]);
});

test('summary totals the activity metrics by category', () => {
  const summary = summarizeHasilKegiatan([
    { category: 'kesehatan-ibu-anak', key: 'jml_bumil', value: 12 },
    { category: 'gizi', key: 'balita_ditimbang', value: 38 },
    { category: 'gizi', key: 'balita_naik_bb', value: 30 },
    { category: 'kb', key: 'pus_binaan', value: 75 },
    { category: 'imunisasi', key: 'dpt_hb_hib_3', value: 16 },
  ]);

  assert.equal(summary.total, 5);
  assert.equal(summary.byCategory['kesehatan-ibu-anak'], 1);
  assert.equal(summary.byCategory.gizi, 2);
  assert.equal(summary.byCategory.kb, 1);
  assert.equal(summary.byCategory.imunisasi, 1);
  assert.equal(summary.byKey.jml_bumil, 12);
  assert.equal(summary.byKey.balita_naik_bb, 30);
});
