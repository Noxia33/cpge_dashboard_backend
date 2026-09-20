import { Router } from 'express';
import authRoutes from './auth.routes';
import revisionRoutes from './revision.routes';
import schoolRoutes from './school.routes';
import rankingRoutes from './ranking.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'API Backend Prépa opérationnelle 🚀' });
});

router.use('/auth', authRoutes);
router.use('/revision', revisionRoutes);
router.use('/schools', schoolRoutes);
router.use('/ranking', rankingRoutes);

export default router;
