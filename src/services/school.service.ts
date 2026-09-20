import prisma from '../db';
import { HttpError } from '../errors';
import type { Filiere } from '../generated/prisma/client';

export class SchoolService {
  static async list(filiere?: Filiere) {
    return prisma.school.findMany({
      where: filiere ? { filieres: { has: filiere } } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  static async getById(id: string) {
    const school = await prisma.school.findUnique({ where: { id } });
    if (!school) throw new HttpError(404, 'École introuvable');
    return school;
  }
}
