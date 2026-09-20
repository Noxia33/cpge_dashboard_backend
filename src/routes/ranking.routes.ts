import { Router } from 'express';
import { getRanking } from '../controllers/ranking.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getRanking);

export default router;
