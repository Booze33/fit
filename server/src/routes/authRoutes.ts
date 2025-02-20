import express from 'express';
import { register, login, getCurrentUser, forgotPassword, resetPassword } from '../controllers/authControllers';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/signin', login);
router.get('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticateToken, getCurrentUser)

router.get('/dashboard', authenticateToken, (req, res) => {
  res.json({
    message: 'Welcome to your dashboard',
    userId: req
  });
});


export default router;
