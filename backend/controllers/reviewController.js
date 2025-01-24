import Sitter from '../models/Sitter.js';
import Review from '../models/Review.js';

// Add a new review
export const addReview = async (req, res) => {
  const { sitterId } = req.params;
  const { rating, comment } = req.body;

  try {
    const sitter = await Sitter.findById(sitterId);
    if (!sitter) {
      return res.status(404).json({ message: 'Sitter not found' });
    }

    const review = new Review({
      ownerId: req.user._id,
      rating,
      comment,
    });

    sitter.reviews.push(review);
    await sitter.save();
    await review.save();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews for a sitter
export const getReviews = async (req, res) => {
  const { sitterId } = req.params;

  try {
    const sitter = await Sitter.findById(sitterId).populate('reviews.ownerId', 'name email');
    if (!sitter) {
      return res.status(404).json({ message: 'Sitter not found' });
    }

    res.status(200).json(sitter.reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing review
export const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this review' });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this review' });
    }

    const sitter = await Sitter.findOne({ 'reviews._id': reviewId });
    if (sitter) {
      sitter.reviews = sitter.reviews.filter((r) => r._id.toString() !== reviewId);
      await sitter.save();
    }

    await review.deleteOne();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
