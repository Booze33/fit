import { PrismaClient } from'@prisma/client';
import { Request, Response } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    // Add other user properties you might need
  };
}

const prisma = new PrismaClient();

export const getWorkouts = async (req: AuthRequest, res: Response) => {
  try {
    const workouts = await prisma.workout.findMany({
      where: {
        userId: req.user!.id
      },
      orderBy: {
        startTime: 'desc'
      }
    });

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching workouts' });
  }
};

export const getWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const workout = await prisma.workout.findUnique({
      where: {
        id,
      }
    });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    if (workout.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching workout' });
  }
};

export const createWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const { type, startTime, endTime, duration, calories, distance, notes } = req.body;

    const workout = await prisma.workout.create({
      data: {
        userId: req.user!.id,
        type,
        startTime,
        endTime,
        duration,
        calories,
        distance,
        notes
      }
    });

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Error creating workout' });
  }
};

export const updateWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { type, startTime, endTime, duration, calories, distance, notes } = req.body;

    const workout = await prisma.workout.findUnique({
      where: {
        id,
      }
    });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    if (workout.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedWorkout = await prisma.workout.update({
      where: {
        id,
      },
      data: {
        type,
        startTime,
        endTime,
        duration,
        calories,
        distance,
        notes
      }
    });

    res.json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ error: 'Error updating workout' });
  }
};

export const deleteWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const workout = await prisma.workout.findUnique({
      where: {
        id,
      }
    });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    if (workout.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.workout.delete({
      where: {
        id,
      }
    });

    res.json({ message: 'Workout deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting workout' });
  }
};

export const workoutStats = async (req: AuthRequest, res: Response) => {
  try {
    const { timeRange } = req.query;
    let dateFilter: any = {};

    const now = new Date();
    if (timeRange === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      dateFilter = {
        startTime: {
          gte: weekAgo
        }
      };
    } else if (timeRange === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      dateFilter = {
        startTime: {
          gte: monthAgo
        }
      };
    }

    const workouts = await prisma.workout.findMany({
      where: {
        userId: req.user!.id,
        ...dateFilter
      }
    });

    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
    const totalCalories = workouts.reduce((sum, workout) => sum + (workout.calories || 0), 0);
    const totalDistance = workouts.reduce((sum, workout) => sum + (workout.distance || 0), 0);

    const workoutsByType: Record<string, number> = {};
    workouts.forEach(workout => {
      workoutsByType[workout.type] = (workoutsByType[workout.type] || 0) + 1;
    });
    
    res.json({
      totalWorkouts,
      totalDuration,
      totalCalories,
      totalDistance,
      workoutsByType
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching workout stats' });
  }
}