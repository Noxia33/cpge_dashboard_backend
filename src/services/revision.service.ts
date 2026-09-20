import prisma from '../db';
import { HttpError } from '../errors';
import type { Filiere, Statut } from '../generated/prisma/client';

export class RevisionService {
  // Chapitres de la filière de l'étudiant
  static async listChapters(filiere: Filiere) {
    return prisma.chapter.findMany({
      where: { filiere },
      orderBy: [{ subject: 'asc' }, { position: 'asc' }],
    });
  }

  // Progression de l'étudiant + statistiques globales
  static async getDashboard(userId: string) {
    const progressions = await prisma.progression.findMany({
      where: { userId },
      include: { chapter: true },
      orderBy: { updatedAt: 'desc' },
    });

    const totalTimeSpent = progressions.reduce((sum, p) => sum + p.timeSpent, 0);
    const totalExercises = progressions.reduce((sum, p) => sum + p.exercisesDone, 0);
    const masteredChapters = progressions.filter((p) => p.statut === 'MAITRISE').length;

    return {
      stats: {
        totalTimeSpentMinutes: totalTimeSpent,
        totalExercisesDone: totalExercises,
        masteredChaptersCount: masteredChapters,
      },
      progressions,
    };
  }

  // Met à jour la progression : statut remplacé, temps et exercices AJOUTÉS au cumul existant
  static async updateProgression(
    userId: string,
    filiere: Filiere,
    chapterId: string,
    data: { statut?: Statut; timeSpent?: number; exercisesDone?: number },
  ) {
    const chapter = await prisma.chapter.findFirst({ where: { id: chapterId, filiere } });
    if (!chapter) throw new HttpError(404, 'Chapitre introuvable pour votre filière');

    return prisma.progression.upsert({
      where: { userId_chapterId: { userId, chapterId } },
      update: {
        ...(data.statut !== undefined && { statut: data.statut }),
        ...(data.timeSpent !== undefined && { timeSpent: { increment: data.timeSpent } }),
        ...(data.exercisesDone !== undefined && { exercisesDone: { increment: data.exercisesDone } }),
      },
      create: {
        userId,
        chapterId,
        statut: data.statut ?? 'EN_COURS',
        timeSpent: data.timeSpent ?? 0,
        exercisesDone: data.exercisesDone ?? 0,
      },
      include: { chapter: true },
    });
  }
}
