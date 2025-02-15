import { PrismaClient } from'@prisma/client';
import { Request, Response } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    // Add other user properties you might need
  };
}

const prisma = new PrismaClient();

export const getHealthMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;
    
    let dateFilter: any = {};
    
    if (startDate && endDate) {
      dateFilter = {
        timestamp: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        }
      };
    } else if (startDate) {
      dateFilter = {
        timestamp: {
          gte: new Date(startDate as string)
        }
      };
    } else if (endDate) {
      dateFilter = {
        timestamp: {
          lte: new Date(endDate as string)
        }
      };
    }
    
    const metrics = await prisma.healthMetric.findMany({
      where: {
        userId: req.user!.id,
        type,
        ...dateFilter
      },
      orderBy: {
        timestamp: 'asc'
      }
    });
    
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching health metrics' });
  }
}

export const createHealthMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const { type, value, timestamp, source } = req.body;
    
    const metric = await prisma.healthMetric.create({
      data: {
        userId: req.user!.id,
        type,
        value,
        timestamp: new Date(timestamp),
        source
      }
    });
    
    res.status(201).json(metric);
  } catch (error) {
    res.status(500).json({ error: 'Error creating health metric' });
  }
}

export const bulkCreateHealthMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const { metrics } = req.body;
    
    if (!Array.isArray(metrics)) {
      return res.status(400).json({ error: 'Metrics must be an array' });
    }
    
    const createdMetrics = await prisma.$transaction(
      metrics.map(metric => 
        prisma.healthMetric.create({
          data: {
            userId: req.user!.id,
            type: metric.type,
            value: metric.value,
            timestamp: new Date(metric.timestamp),
            source: metric.source
          }
        })
      )
    );
    
    res.status(201).json({ count: createdMetrics.length });
  } catch (error) {
    res.status(500).json({ error: 'Error creating health metrics' });
  }
}

export const getAggregatedMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.params;
    const { interval, startDate, endDate } = req.query;
    
    let dateFilter: any = {};
    
    if (startDate && endDate) {
      dateFilter = {
        timestamp: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        }
      };
    } else if (startDate) {
      dateFilter = {
        timestamp: {
          gte: new Date(startDate as string)
        }
      };
    } else {
      // Default to last 7 days if no dates provided
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = {
        timestamp: {
          gte: weekAgo
        }
      };
    }
    
    const metrics = await prisma.healthMetric.findMany({
      where: {
        userId: req.user!.id,
        type,
        ...dateFilter
      },
      orderBy: {
        timestamp: 'asc'
      }
    });
    
    let aggregatedData;
    
    // Aggregate data based on the requested interval
    if (interval === 'daily') {
      // Group by day
      const dailyData: Record<string, number> = {};
      metrics.forEach(metric => {
        const date = metric.timestamp.toISOString().split('T')[0];
        if (!dailyData[date]) {
          dailyData[date] = 0;
        }
        dailyData[date] += metric.value;
      });
      
      aggregatedData = Object.entries(dailyData).map(([date, value]) => ({
        date,
        value
      }));
    } else if (interval === 'hourly') {
      // Group by hour
      const hourlyData: Record<string, number> = {};
      metrics.forEach(metric => {
        const dateTime = metric.timestamp.toISOString().substring(0, 13);
        if (!hourlyData[dateTime]) {
          hourlyData[dateTime] = 0;
        }
        hourlyData[dateTime] += metric.value;
      });
      
      aggregatedData = Object.entries(hourlyData).map(([dateTime, value]) => ({
        dateTime,
        value
      }));
    } else {
      // Default: return raw data
      aggregatedData = metrics.map(metric => ({
        timestamp: metric.timestamp,
        value: metric.value
      }));
    }
    
    res.json(aggregatedData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching health metrics statistics' });
  }
};

export const deleteHealthMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const deleteResult = await prisma.healthMetric.deleteMany({
      where: {
        userId: req.user!.id,
        type,
        timestamp: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        }
      }
    });

    res.json({ count: deleteResult.count })
  } catch (error) {
    res.status(500).json({ error: 'Error deleting health metric' });
  }
}

export const createEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const { dataPoints } = req.body;

    if (!Array.isArray(dataPoints)) {
      return res.status(400).json({ error: 'dataPoints must be an array' });
    }

    const transformedMetrics = dataPoints.map(point => ({
      userId: req.user!.id,
      type: mapGoogleFitTypeToInternal(point.dataType),
      value: point.value,
      timestamp: new Date(point.startTimeMillis),
      source: 'google_fit'
    }));

    const syncResults = await Promise.all(
      transformedMetrics.map(metric => 
        prisma.healthMetric.upsert({
          where: {
            userId_type_timestamp: {
              userId: metric.userId,
              type: metric.type,
              timestamp: metric.timestamp
            }
          },
          update: {
            value: metric.value
          },
          create: metric
        })
      )
    );

    res.status(200).json({
      synced: syncResults.length,
      source: 'google_fit'
    });
  } catch (error) {
    res.status(500).json({ error: 'Error syncing with Google Fit' });
  }
}

const mapGoogleFitTypeToInternal = (externalType: string) => {
  const typeMap: Record<string, string> = {
    'com.google.step_count.delta': 'steps',
    'com.google.heart_rate.bpm': 'heart_rate',
    'com.google.calories.expended': 'calories',
    'com.google.distance.delta': 'distance',
    'com.google.weight': 'weight'
  }

  return typeMap[externalType] || externalType;
}