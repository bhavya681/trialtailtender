import express from 'express';
import { registerSitter, getSitters, updateSitter, deleteSitter, getAllSitters,getSittersById } from '../controllers/sitterController.js';
import { checkRole } from '../middlewares/checkRole.js';
import {protect} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register',protect,checkRole(['sitter','owner']), registerSitter);
router.get('/',protect, checkRole(['sitter','owner']), getSitters);
router.get('/sitter/:id',protect, checkRole(['sitter','owner']), getSittersById);
router.put('/edit/:id',protect, checkRole(['sitter','owner']), updateSitter);
router.delete('/delete/:id',protect, checkRole(['sitter','owner']), deleteSitter);
router.get('/all',protect, checkRole(['sitter','owner']), getAllSitters);

export default router;
