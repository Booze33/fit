import express from 'express';
import authRoutes from './authRoutes';
import workoutRoutes from './workoutRoutes';
import healthMetricsRoutes from './healthMetricsRoutes'

const router = express.Router();

// Mount all feature routes
router.use("/auth", authRoutes);
router.use("/workouts", workoutRoutes);
router.use("/healthMetrics", healthMetricsRoutes);

export default router;