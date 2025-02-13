import express from 'express';
import { getWorkouts, getWorkout, createWorkout, updateWorkout, deleteWorkout, workoutStats } from '../controllers/workoutsControllers';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getWorkouts);
router.get('/:id', authenticateToken, getWorkout);
router.post('/', authenticateToken, createWorkout);
router.put('/:id', authenticateToken, updateWorkout);
router.delete('/:id', authenticateToken, deleteWorkout);
router.get('/stats/summary', authenticateToken, workoutStats);

export default router;