import { Router } from 'express';
import { getDashboard, listChapters, updateProgression } from '../controllers/revision.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);
router.get('/dashboard', getDashboard);
router.get('/chapters', listChapters);
router.put('/chapters/:chapterId', updateProgression);

export default router;
