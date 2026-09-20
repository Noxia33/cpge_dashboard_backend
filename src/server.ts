import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Serveur backend démarré sur : http://localhost:${PORT}`);
  console.log(`🩺 Vérification de santé : http://localhost:${PORT}/api/health\n`);
});