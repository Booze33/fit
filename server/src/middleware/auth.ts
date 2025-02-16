import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    name?: string;
  };
}

interface DecodedToken {
  userId: string;
  email?: string;
  iat: number;
  exp: number;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        error: 'Authorization header missing',
        message: 'Please provide a valid authentication token'
      });
    }

    // Validate Bearer token format
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({
        error: 'Invalid token format',
        message: 'Authorization header must be in the format "Bearer <token>"'
      });
    }

    const token = tokenParts[1];

    // Verify token
    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret'
      ) as DecodedToken;
    } catch (verifyError) {
      if (verifyError instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          error: 'Token expired',
          message: 'Your session has expired. Please log in again'
        });
      }

      if (verifyError instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          error: 'Invalid token',
          message: 'The provided authentication token is invalid'
        });
      }

      throw verifyError;
    }

    // Validate userId
    if (!decoded.userId) {
      return res.status(401).json({
        error: 'Invalid token payload',
        message: 'Token payload must contain userId'
      });
    }

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    if (!user) {
      return res.status(401).json({
        error: 'User not found',
        message: 'The user associated with this token no longer exists'
      });
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      error: 'Authentication failed',
      message: 'An unexpected error occurred during authentication'
    });
  } finally {
    // Ensure Prisma client is disconnected to prevent connection leaks
    await prisma.$disconnect();
  }
};