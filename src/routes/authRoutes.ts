import express from 'express';
import { register, login, getProfile } from '../controllers/authController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getProfile);

export default router;
