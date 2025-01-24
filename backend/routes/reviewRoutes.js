import express from 'express';
import {
  addReview,
  getReviews,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();

// Add a new review
router.post('/:sitterId', protect, checkRole(['owner']), addReview);

// Get all reviews for a sitter
router.get('/:sitterId', protect, getReviews);

// Update an existing review
router.put('/:reviewId', protect, checkRole(['owner']), updateReview);

// Delete a review
router.delete('/:reviewId', protect, checkRole(['owner']), deleteReview);

export default router;
