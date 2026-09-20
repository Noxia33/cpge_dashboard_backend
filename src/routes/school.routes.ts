import { Router } from 'express';
import { listSchools, getSchool } from '../controllers/school.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);
router.get('/', listSchools);
router.get('/:id', getSchool);

export default router;
