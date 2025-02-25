import express from 'express';
import {
  register,
  login,
  forgotPassword,
  getProfile,
  changePassword,
  editProfile,
  deleteProfile,
  OwnersList,
  getProfileById,
  getBreedersList,
  getBreederProfile,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/profile', protect, getProfile);
router.get('/profile/:id', protect, getProfileById);
router.put('/change-password', changePassword);
router.put('/edit-profile', protect, editProfile);
router.delete('/delete-profile', protect, deleteProfile);
router.get('/owners-list', protect, OwnersList);
router.get('/breeders-list', protect, getBreedersList);
router.get('/breeders-profile/:breederId', protect, getBreederProfile);

export default router;
