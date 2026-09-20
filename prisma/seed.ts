import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Filiere } from '../src/generated/prisma/client';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const schools: { name: string; city: string; filieres: Filiere[]; website?: string }[] = [
  { name: 'École polytechnique', city: 'Palaiseau', filieres: ['MP', 'MPI', 'PC', 'PSI', 'PT'], website: 'https://www.polytechnique.edu' },
  { name: 'CentraleSupélec', city: 'Gif-sur-Yvette', filieres: ['MP', 'MPI', 'PC', 'PSI', 'PT', 'TSI'], website: 'https://www.centralesupelec.fr' },
  { name: 'Mines Paris - PSL', city: 'Paris', filieres: ['MP', 'MPI', 'PC', 'PSI', 'PT'], website: 'https://www.minesparis.psl.eu' },
  { name: 'Télécom Paris', city: 'Palaiseau', filieres: ['MP', 'MPI', 'PC', 'PSI'], website: 'https://www.telecom-paris.fr' },
  { name: 'ENS Ulm', city: 'Paris', filieres: ['MP', 'MPI', 'PC', 'PSI', 'BCPST'], website: 'https://www.ens.psl.eu' },
  { name: 'AgroParisTech', city: 'Palaiseau', filieres: ['BCPST'], website: 'https://www.agroparistech.fr' },
  { name: 'HEC Paris', city: 'Jouy-en-Josas', filieres: ['ECG'], website: 'https://www.hec.edu' },
  { name: 'ESSEC', city: 'Cergy', filieres: ['ECG'], website: 'https://www.essec.edu' },
];

const chapters: { filiere: Filiere; subject: string; titles: string[] }[] = [
  { filiere: 'MPSI', subject: 'Mathématiques', titles: ['Nombres complexes', 'Suites réelles', 'Limites et continuité', 'Dérivation', 'Espaces vectoriels'] },
  { filiere: 'MPSI', subject: 'Physique', titles: ['Cinématique', 'Dynamique du point', 'Circuits électriques', 'Thermodynamique'] },
  { filiere: 'MP', subject: 'Mathématiques', titles: ['Réduction des endomorphismes', 'Séries entières', 'Espaces préhilbertiens', 'Probabilités'] },
  { filiere: 'PCSI', subject: 'Chimie', titles: ['Structure de la matière', 'Cinétique chimique', 'Thermochimie'] },
];

async function main() {
  for (const s of schools) {
    await prisma.school.upsert({ where: { name: s.name }, update: s, create: s });
  }

  for (const group of chapters) {
    for (const [position, title] of group.titles.entries()) {
      await prisma.chapter.upsert({
        where: { filiere_subject_title: { filiere: group.filiere, subject: group.subject, title } },
        update: { position },
        create: { filiere: group.filiere, subject: group.subject, title, position },
      });
    }
  }

  console.log('✅ Seed terminé');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
