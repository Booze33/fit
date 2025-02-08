import express from 'express';
import { requireAuth, clerkMiddleware } from '@clerk/express'
import cors from 'cors';
const routes = require('./routes/index');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.set('trust proxy', 1);
app.use(clerkMiddleware());

app.use('/api', requireAuth(), routes);

// Mount Routes
app.use("/api", routes);

module.exports = app;