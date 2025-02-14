import express from 'express';
import { getHealthMetrics, createHealthMetrics, bulkCreateHealthMetrics, getAggregatedMetrics, deleteHealthMetrics, createEndpoint } from '../controllers/healthMetricsControllers';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/:type', authenticateToken, getHealthMetrics);
router.post('/', authenticateToken, createHealthMetrics);
router.post('/bulk', authenticateToken, bulkCreateHealthMetrics);
router.get('/aggregated/:type', authenticateToken, getAggregatedMetrics);
router.delete('/:type', authenticateToken, deleteHealthMetrics);
router.post('/sync/google-fit', authenticateToken, createEndpoint);

export default router;