import express from "express";
import { clerkClient, getAuth } from '@clerk/express';
import { requireAuth } from '../middleware/clerkMiddleware';

const router = express.Router();

// QR Code routes
router.get('/public', (req, res) => {
  res.json({ message: 'This is a public route' });
});

router.get('/protected', requireAuth, (req, res) => {
  const auth = getAuth(req);
  res.json({ 
    message: 'This is a protected route',
    userId: auth.userId 
  });
});

router.get('/admin', requireAuth, (req, res) => {
  const auth = getAuth(req);
  
  // Example permission check
  if (!auth.has({ permission: 'org:admin' })) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  
  res.json({ message: 'Admin access granted' });
});

router.get('/user-profile', requireAuth, async (req, res) => {
  try {
    const auth = getAuth(req);
    const user = await clerkClient.users.getUser(auth.userId);
    
    res.json({
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

module.exports = router;