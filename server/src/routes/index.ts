import express from 'express';
import authRoutes from './authRoutes';
import workoutRoutes from './workoutRoutes';

const router = express.Router();

// Mount all feature routes
router.use("/auth", authRoutes);
router.use("/workouts", workoutRoutes);

export default router;