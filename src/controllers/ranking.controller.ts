import { Request, Response } from 'express';
import { z } from 'zod';
import { RankingService } from '../services/ranking.service';
import { requireUser } from '../middlewares/auth.middleware';

export const getRanking = async (req: Request, res: Response) => {
  const { userId, filiere } = requireUser(req);
  const { limit } = z.object({ limit: z.coerce.number().int().min(1).max(200).default(50) }).parse(req.query);
  res.json(await RankingService.getRanking(filiere, userId, limit));
};
