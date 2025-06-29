import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getWeeklyProgress } from '../lib/actions/data.action';

interface WeeklyProgress {
  date: string;
  totalCalories: number;
  totalProtein: number;
}

const WeeklyProgressScreen: React.FC = () => {
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([]);

  useEffect(() => {
    const fetchWeeklyProgress = async () => {
      const progress = await getWeeklyProgress();
      setWeeklyProgress(progress);
    };

    fetchWeeklyProgress();
  }, []);

  return (
    <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={styles.title}>Weekly Progress</Text>
      <View style={styles.progressList}>
        {weeklyProgress.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.dateText}>{day.date}</Text>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}>Calories: {day.totalCalories}</Text>
              <Text style={styles.detailText}>Protein: {day.totalProtein}g</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressList: {
    width: '100%',
  },
  dayContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 16,
  },
});

export default WeeklyProgressScreen;
