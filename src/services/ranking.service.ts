import prisma from '../db';
import type { Filiere } from '../generated/prisma/client';

// Classement des étudiants d'une filière : chapitres maîtrisés, puis exercices, puis temps de travail.
export class RankingService {
  static async getRanking(filiere: Filiere, currentUserId: string, limit = 50) {
    const users = await prisma.user.findMany({
      where: { filiere },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        progressions: { select: { statut: true, timeSpent: true, exercisesDone: true } },
      },
    });

    const scored = users
      .map((u) => ({
        userId: u.id,
        // Anonymisation partielle : prénom + initiale du nom
        name: `${u.firstName} ${u.lastName.charAt(0).toUpperCase()}.`,
        masteredChapters: u.progressions.filter((p) => p.statut === 'MAITRISE').length,
        totalExercisesDone: u.progressions.reduce((s, p) => s + p.exercisesDone, 0),
        totalTimeSpentMinutes: u.progressions.reduce((s, p) => s + p.timeSpent, 0),
      }))
      .sort(
        (a, b) =>
          b.masteredChapters - a.masteredChapters ||
          b.totalExercisesDone - a.totalExercisesDone ||
          b.totalTimeSpentMinutes - a.totalTimeSpentMinutes,
      )
      .map((entry, index) => ({ rank: index + 1, ...entry }));

    const me = scored.find((e) => e.userId === currentUserId) ?? null;

    return {
      filiere,
      totalStudents: scored.length,
      me,
      // On ne renvoie pas les identifiants des autres étudiants
      ranking: scored.slice(0, limit).map(({ userId, ...rest }) => ({ ...rest, isMe: userId === currentUserId })),
    };
  }
}
