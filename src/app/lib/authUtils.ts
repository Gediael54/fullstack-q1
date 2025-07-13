import jwt from 'jsonwebtoken';
import { TokenUser } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-aqui';

export const generateToken = (user: TokenUser): string => {
  return jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return null;
  }
};