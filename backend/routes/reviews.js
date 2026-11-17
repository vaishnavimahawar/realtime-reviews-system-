const express = require('express');
const router = express.Router();
const db = require('../database');

module.exports = (broadcast) => {
  // GET all reviews
  router.get('/', (_req, res) => {
    try {
      const reviews = db.getAllReviews();
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

  // GET single review by id
  router.get('/:id', (req, res) => {
    try {
      const review = db.getReviewById(req.params.id);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }
      res.json(review);
    } catch (error) {
      console.error('Error fetching review:', error);
      res.status(500).json({ error: 'Failed to fetch review' });
    }
  });

  // POST create review (also used for undo-restore)
  router.post('/', (req, res) => {
    try {
      const { title, content, id, created_at } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const review = db.createReview({ id, title, content, created_at });

      broadcast({ type: 'created', review });

      res.status(201).json(review);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ error: 'Failed to create review' });
    }
  });

  // PUT update review
  router.put('/:id', (req, res) => {
    try {
      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const review = db.updateReview(req.params.id, { title, content });

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      broadcast({ type: 'updated', review });

      res.json(review);
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ error: 'Failed to update review' });
    }
  });

  // DELETE review
  router.delete('/:id', (req, res) => {
    try {
      const review = db.deleteReview(req.params.id);

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      broadcast({ type: 'deleted', review });

      res.json(review);
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'Failed to delete review' });
    }
  });

  return router;
};
