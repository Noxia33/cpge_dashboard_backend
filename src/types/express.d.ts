import type { Filiere } from '../generated/prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        filiere: Filiere;
      };
    }
  }
}

export {};
