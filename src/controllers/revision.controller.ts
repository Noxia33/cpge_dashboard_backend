import { Request, Response } from 'express';
import { z } from 'zod';
import { Statut } from '../generated/prisma/client';
import { RevisionService } from '../services/revision.service';
import { requireUser } from '../middlewares/auth.middleware';

const updateSchema = z
  .object({
    statut: z.enum(Statut).optional(),
    timeSpent: z.number().int().min(1).max(1440).optional(), // minutes à ajouter
    exercisesDone: z.number().int().min(1).max(1000).optional(), // exercices à ajouter
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'Au moins un champ à mettre à jour est requis' });

export const getDashboard = async (req: Request, res: Response) => {
  res.json(await RevisionService.getDashboard(requireUser(req).userId));
};

export const listChapters = async (req: Request, res: Response) => {
  res.json(await RevisionService.listChapters(requireUser(req).filiere));
};

export const updateProgression = async (req: Request, res: Response) => {
  const { userId, filiere } = requireUser(req);
  const chapterId = z.string().min(1).parse(req.params.chapterId);
  const data = updateSchema.parse(req.body);
  res.json(await RevisionService.updateProgression(userId, filiere, chapterId, data));
};
