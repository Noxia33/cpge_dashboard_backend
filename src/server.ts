import app from './app';
import { env } from './config/env';
import prisma from './db';

const server = app.listen(env.PORT, () => {
  console.log(`\n🚀 Serveur backend démarré sur : http://localhost:${env.PORT}`);
  console.log(`🩺 Vérification de santé : http://localhost:${env.PORT}/api/health\n`);
});

const shutdown = (signal: string) => {
  console.log(`\n${signal} reçu, arrêt du serveur...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
