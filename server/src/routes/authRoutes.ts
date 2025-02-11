import express from 'express';
import { register, login } from '../controllers/authControllers.js';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/signin', login);

router.get('/me', authenticateToken, (req, res) => {
  res.json({
    message: 'You have accessed a protected route',
    user: req
  });
});

router.get('/dashboard', authenticateToken, (req, res) => {
  res.json({
    message: 'Welcome to your dashboard',
    userId: req
  });
});


export default router;
