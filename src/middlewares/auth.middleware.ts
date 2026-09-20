import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { HttpError } from '../errors';
import type { Filiere } from '../generated/prisma/client';

export const authenticateToken = (req: Request, _res: Response, next: NextFunction) => {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new HttpError(401, 'Accès non autorisé : token manquant');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload & {
      userId: string;
      filiere: Filiere;
    };
    req.user = { userId: decoded.userId, filiere: decoded.filiere };
    next();
  } catch {
    throw new HttpError(401, 'Token invalide ou expiré');
  }
};

/** À utiliser après authenticateToken : garantit que req.user est défini. */
export const requireUser = (req: Request) => {
  if (!req.user) throw new HttpError(401, 'Non authentifié');
  return req.user;
};
