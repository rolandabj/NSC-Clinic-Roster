import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchesFilter } from '../../src/services/repository/liveCollectionCache';

test('cached filters match like Firestore where clauses', () => {
  const a = { id: '1', scheduleId: 's1', status: 'PENDING' };
  const b = { id: '2', scheduleId: 's2' };
  assert.equal(matchesFilter(a, { field: 'scheduleId', operator: '==', value: 's1' }), true);
  assert.equal(matchesFilter(b, { field: 'scheduleId', operator: '==', value: 's1' }), false);
  assert.equal(matchesFilter(a, { field: 'status', operator: '!=', value: 'APPROVED' }), true);
  // A missing field matches neither == nor != in Firestore
  assert.equal(matchesFilter(b, { field: 'status', operator: '!=', value: 'APPROVED' }), false);
  assert.equal(matchesFilter(b, { field: 'status', operator: '==', value: undefined }), false);
});
