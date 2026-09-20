import prisma from '../db';

export class RevisionService {
  // Récupérer tous les chapitres d'une filière avec la progression de l'étudiant
  static async getDashboard(userId: string) {
    const progressions = await prisma.progression.findMany({
      where: { userId },
      include: { chapter: true },
    });

    // Statistiques globales
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

  // Mettre à jour la progression sur un chapitre (statut, temps passé, exos faits)
  static async updateProgression(userId: string, chapterId: string, data: { statut?: 'A_FAIRE' | 'EN_COURS' | 'MAITRISE'; timeSpent?: number; exercisesDone?: number }) {
    return await prisma.progression.upsert({
      where: {
        id: `${userId}_${chapterId}`, // Ou clé composée
      },
      update: {
        ...(data.statut && { statut: data.statut }),
        ...(data.timeSpent && { timeSpent: { increment: data.timeSpent } }),
        ...(data.exercisesDone && { exercisesDone: { increment: data.exercisesDone } }),
      },
      create: {
        userId,
        chapterId,
        statut: data.statut || 'EN_COURS',
        timeSpent: data.timeSpent || 0,
        exercisesDone: data.exercisesDone || 0,
      },
    });
  }
}