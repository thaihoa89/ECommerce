import express from 'express';
import { getMe, deleteMe } from '../controllers/userController.js';

const router = express.Router();

// GET /user
router.get('', getMe);

// DELETE /user
router.delete('', deleteMe);

export default router;