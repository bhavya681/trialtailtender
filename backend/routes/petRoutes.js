import express from 'express';
import { 
  addPet, 
  getPets, 
  updatePet, 
  deletePet, 
  getPetById
} from '../controllers/petController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();
// Owner-specific routes
router.post('/', protect, checkRole(['owner']), addPet);
router.get('/', protect, checkRole(['owner']), getPets);
router.put('/edit/:id', protect, checkRole(['owner']), updatePet);
router.delete('/delete/:id', protect, checkRole(['owner']), deletePet);
router.get('/:id', protect, checkRole(['owner']), getPetById);

export default router;
