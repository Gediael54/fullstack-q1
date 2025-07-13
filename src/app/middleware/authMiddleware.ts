import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthenticatedUser } from '../types';

export interface AuthenticatedRequest extends NextRequest {
  user?: AuthenticatedUser;
}

export const authenticateToken = async (
  request: NextRequest
): Promise<
  | { user: AuthenticatedUser }
  | { error: string }
> => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return { error: 'Authorization header missing' };
    }
    if (!authHeader.startsWith('Bearer ')) {
      return { error: 'Invalid authorization format. Use Bearer token' };
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return { error: 'Access token required' };
    }
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set');
      return { error: 'Server configuration error' };
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    if (!decoded.userId) {
      return { error: 'Invalid token payload' };
    }
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      return { error: 'User not found' };
    }
    return {
      user: {
        id: user.id,
        email: user.email,
      },
    };
  } catch (error) {
    console.error('Authentication error:', error);
    if (error instanceof jwt.TokenExpiredError) {
      return { error: 'Token expired' };
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return { error: 'Invalid token' };
    }
    return { error: 'Authentication failed' };
  }
};

export const withAuth = <
  C extends { params?: Record<string, string> } = { params?: Record<string, string> }
>(
  handler: (request: AuthenticatedRequest, context: C) => Promise<any>
) => {
  return async (request: NextRequest, context: C) => {
    const authResult = await authenticateToken(request);
    if ('error' in authResult) {
      return new Response(
        JSON.stringify({
          error: authResult.error,
          code: 'AUTHENTICATION_FAILED',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    (request as AuthenticatedRequest).user = authResult.user;
    return handler(request as AuthenticatedRequest, context);
  };
};