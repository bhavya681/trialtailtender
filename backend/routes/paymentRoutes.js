import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { createCustomer, addNewCard, createCharges } from '../controllers/paymentController.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();

router.post('/createCustomer', createCustomer);
router.post('/add-card', addNewCard);
router.post('/create-charge', createCharges);

export default router;