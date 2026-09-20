import { Request, Response } from 'express';
import { z } from 'zod';
import { Filiere } from '../generated/prisma/client';
import { AuthService } from '../services/auth.service';
import { requireUser } from '../middlewares/auth.middleware';

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères').max(72),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  filiere: z.enum(Filiere),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1).max(72),
});

export const register = async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  res.status(201).json(await AuthService.register(data));
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);
  res.json(await AuthService.login(email, password));
};

export const me = async (req: Request, res: Response) => {
  res.json(await AuthService.getMe(requireUser(req).userId));
};
