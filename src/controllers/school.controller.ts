import { Request, Response } from 'express';
import { z } from 'zod';
import { Filiere } from '../generated/prisma/client';
import { SchoolService } from '../services/school.service';

export const listSchools = async (req: Request, res: Response) => {
  const { filiere } = z.object({ filiere: z.enum(Filiere).optional() }).parse(req.query);
  res.json(await SchoolService.list(filiere));
};

export const getSchool = async (req: Request, res: Response) => {
  const id = z.string().min(1).parse(req.params.id);
  res.json(await SchoolService.getById(id));
};
