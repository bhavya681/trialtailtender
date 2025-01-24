import express from 'express';
import {
    createBooking,
    getBookings,
    getBookingDetails,
    updateBooking,
    deleteBooking,
    confirmBooking,
    editStatus,
    getSitterBookings,
} from '../controllers/bookingController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();

// POST: Create a new booking
router.post('/', protect, createBooking);

// GET: Get all bookings for the logged-in user
router.get('/', protect, getBookings);

// GET: Get booking details by ID
router.get('/:id', protect, getBookingDetails);

// PUT: Update booking details (e.g., startDate, endDate)
router.put('/:id', protect, checkRole(['owner']), updateBooking);

// PATCH: Confirm a booking (set status to 'confirmed')
router.patch('/:id/confirm', protect, confirmBooking);

router.put('/:id/status', protect, checkRole(['sitter']), editStatus);

// DELETE: Cancel/Delete a booking
router.delete('/:id', protect, deleteBooking);

router.get('/bookings/sitter/:id', protect, getSitterBookings);

export default router;