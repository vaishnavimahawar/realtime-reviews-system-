const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'reviews.json');

// Ensure database file is backup/isolated
test.beforeEach(() => {
  fs.writeFileSync(DB_FILE, JSON.stringify([]), 'utf-8');
});

test.after(() => {
  // Clean up
  if (fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]), 'utf-8');
  }
});

const db = require('../database');

test('Database CRUD Operations', async (t) => {
  await t.test('createReview creates and stores a review', () => {
    const review = db.createReview({
      title: 'Great Experience',
      content: 'I really enjoyed using this app!',
    });

    assert.ok(review.id, 'Review should have an id');
    assert.strictEqual(review.title, 'Great Experience');
    assert.strictEqual(review.content, 'I really enjoyed using this app!');
    assert.ok(review.created_at, 'Review should have a created_at timestamp');
  });

  await t.test('getAllReviews returns reviews ordered by created_at desc', () => {
    db.createReview({
      title: 'First Review',
      content: 'First content',
      created_at: new Date('2024-01-01T10:00:00Z').toISOString(),
    });
    db.createReview({
      title: 'Second Review',
      content: 'Second content',
      created_at: new Date('2024-01-02T10:00:00Z').toISOString(),
    });

    const all = db.getAllReviews();
    assert.strictEqual(all.length, 2);
    assert.strictEqual(all[0].title, 'Second Review');
    assert.strictEqual(all[1].title, 'First Review');
  });

  await t.test('getReviewById returns specific review', () => {
    const created = db.createReview({
      title: 'Find Me',
      content: 'Target content',
    });

    const found = db.getReviewById(created.id);
    assert.ok(found);
    assert.strictEqual(found.title, 'Find Me');

    const notFound = db.getReviewById('non-existent-id');
    assert.strictEqual(notFound, null);
  });

  await t.test('updateReview modifies review content and title', () => {
    const created = db.createReview({
      title: 'Old Title',
      content: 'Old Content',
    });

    const updated = db.updateReview(created.id, {
      title: 'New Title',
      content: 'New Content',
    });

    assert.ok(updated);
    assert.strictEqual(updated.title, 'New Title');
    assert.strictEqual(updated.content, 'New Content');
    assert.ok(updated.updated_at, 'Should set updated_at');
  });

  await t.test('deleteReview removes review', () => {
    const created = db.createReview({
      title: 'To Be Deleted',
      content: 'Delete Content',
    });

    const deleted = db.deleteReview(created.id);
    assert.ok(deleted);
    assert.strictEqual(deleted.id, created.id);

    const check = db.getReviewById(created.id);
    assert.strictEqual(check, null);
  });

  await t.test('undo restoration allows recreation with original id and timestamp', () => {
    const originalDate = new Date('2023-05-15T12:00:00Z').toISOString();
    const created = db.createReview({
      id: 'custom-restored-id',
      title: 'Restored Item',
      content: 'Undo works',
      created_at: originalDate,
    });

    assert.strictEqual(created.id, 'custom-restored-id');
    assert.strictEqual(created.created_at, originalDate);

    const fetched = db.getReviewById('custom-restored-id');
    assert.ok(fetched);
    assert.strictEqual(fetched.title, 'Restored Item');
  });
});
