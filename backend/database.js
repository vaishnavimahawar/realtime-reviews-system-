const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_FILE = path.join(__dirname, 'reviews.json');

// Initialize database file if it doesn't exist
const initDb = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
};

const readData = () => {
  try {
    initDb();
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('Error reading DB:', err);
    return [];
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
};

const getAllReviews = () => {
  const reviews = readData();
  // Sort latest first
  return reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

const getReviewById = (id) => {
  const reviews = readData();
  return reviews.find((r) => r.id === id) || null;
};

const createReview = ({ id, title, content, created_at } = {}) => {
  const reviews = readData();
  const reviewId = id || crypto.randomUUID();
  const createdAt = created_at || new Date().toISOString();

  const newReview = {
    id: reviewId,
    title,
    content,
    created_at: createdAt,
    updated_at: null,
  };

  reviews.unshift(newReview);
  writeData(reviews);
  return newReview;
};

const updateReview = (id, { title, content }) => {
  const reviews = readData();
  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) return null;

  reviews[index] = {
    ...reviews[index],
    title,
    content,
    updated_at: new Date().toISOString(),
  };

  writeData(reviews);
  return reviews[index];
};

const deleteReview = (id) => {
  const reviews = readData();
  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const deleted = reviews.splice(index, 1)[0];
  writeData(reviews);
  return deleted;
};

// Initial run
initDb();

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
