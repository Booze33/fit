import express from 'express';
import authRoutes from './authRoutes';

const router = express.Router();

// Mount all feature routes
router.use("/auth", authRoutes);

export default router;