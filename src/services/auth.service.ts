import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import { env } from '../config/env';
import { HttpError } from '../errors';
import type { Filiere } from '../generated/prisma/client';

const SALT_ROUNDS = 12;

const publicUser = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  filiere: true,
  createdAt: true,
} as const;

const signToken = (user: { id: string; filiere: Filiere }) =>
  jwt.sign({ userId: user.id, filiere: user.filiere }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });

export class AuthService {
  static async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    filiere: Filiere;
  }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new HttpError(409, 'Un compte existe déjà avec cet email');

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        filiere: data.filiere,
      },
      select: publicUser,
    });

    return { user, token: signToken(user) };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    // Même message que l'email soit inconnu ou le mot de passe faux (pas d'énumération de comptes)
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !valid) throw new HttpError(401, 'Email ou mot de passe incorrect');

    const { passwordHash: _omit, ...safeUser } = user;
    return { user: safeUser, token: signToken(user) };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUser });
    if (!user) throw new HttpError(404, 'Utilisateur introuvable');
    return user;
  }
}
