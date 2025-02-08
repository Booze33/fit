import express from 'express';
import jwt from 'jsonwebtoken';
import { clerkMiddleware,  ClerkExpressRequireAuth } from '@clerk/express'

export const clerkConfig = {
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
};

export const requireAuth = ClerkExpressRequireAuth();
export const configuredClerkMiddleware = clerkMiddleware(clerkConfig);