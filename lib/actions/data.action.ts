import AsyncStorage from "@react-native-async-storage/async-storage";

const DAYS_TO_KEEP = 30;

const addFoodLog = async ({ food, calories, protein }: { food: string, calories: number, protein: number }) => {
  const today = new Date().toISOString().split("T")[0];
  const newLog = { date: today, food, calories, protein };

  const existing = await AsyncStorage.getItem("foodLogs");
  const logs = existing ? JSON.parse(existing) : [];

  logs.push(newLog);
  
  const cleanedLogs = await cleanupOldLogs(logs);
  
  console.log('stored logs:', cleanedLogs);
  await AsyncStorage.setItem("foodLogs", JSON.stringify(cleanedLogs));
};

const cleanupOldLogs = async (logs: any[]) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - DAYS_TO_KEEP);
  const cutoffDateString = cutoffDate.toISOString().split("T")[0];
  
  return logs.filter(log => log.date >= cutoffDateString);
};

const getTodayProgress = async () => {
  const today = new Date().toISOString().split("T")[0];
  const existing = await AsyncStorage.getItem("foodLogs");
  const logs = existing ? JSON.parse(existing) : [];

  const todaysLogs = logs.filter(log => log.date === today);

  const totalCalories = todaysLogs.reduce((sum, log) => sum + log.calories, 0);
  const totalProtein = todaysLogs.reduce((sum, log) => sum + log.protein, 0);

  return { 
    totalCalories, 
    totalProtein, 
    todaysLogs 
  };
};

const getProgressForDateRange = async (startDate: string, endDate: string) => {
  const existing = await AsyncStorage.getItem("foodLogs");
  const logs = existing ? JSON.parse(existing) : [];
  
  const filteredLogs = logs.filter(log => 
    log.date >= startDate && log.date <= endDate
  );
  
  return filteredLogs;
};

const getWeeklyProgress = async () => {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);
  
  const startDate = weekAgo.toISOString().split("T")[0];
  const endDate = today.toISOString().split("T")[0];
  
  return await getProgressForDateRange(startDate, endDate);
};

const setTargetData = async (targetCalories: number, targetProtein: number) => {
  await AsyncStorage.setItem("targetCalories", targetCalories.toString());
  await AsyncStorage.setItem("targetProtein", targetProtein.toString());
};

const getTargetData = async () => {
  try {
    const targetCalories = await AsyncStorage.getItem("targetCalories");
    const targetProtein = await AsyncStorage.getItem("targetProtein");
    
    return {
      targetCalories: targetCalories ? parseFloat(targetCalories) : 2000,
      targetProtein: targetProtein ? parseFloat(targetProtein) : 150,
    };
  } catch (error) {
    console.error("Error getting target data:", error);
    return { targetCalories: 2000, targetProtein: 150 };
  }
};

const performDataCleanup = async () => {
  try {
    const existing = await AsyncStorage.getItem("foodLogs");
    if (existing) {
      const logs = JSON.parse(existing);
      const cleanedLogs = await cleanupOldLogs(logs);
      await AsyncStorage.setItem("foodLogs", JSON.stringify(cleanedLogs));
      console.log(`Cleaned up data. Kept ${cleanedLogs.length} recent entries.`);
    }
  } catch (error) {
    console.error("Error during data cleanup:", error);
  }
};

const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(['foodLogs', 'targetCalories', 'targetProtein']);
    console.log('All nutrition data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

const getStorageInfo = async () => {
  try {
    const foodLogs = await AsyncStorage.getItem("foodLogs");
    const targetCalories = await AsyncStorage.getItem("targetCalories");
    const targetProtein = await AsyncStorage.getItem("targetProtein");
    
    const logsSize = foodLogs ? JSON.stringify(foodLogs).length : 0;
    const targetsSize = (targetCalories?.length || 0) + (targetProtein?.length || 0);
    
    return {
      totalEntries: foodLogs ? JSON.parse(foodLogs).length : 0,
      dataSize: `${Math.round((logsSize + targetsSize) / 1024)} KB`,
      logsSize: `${Math.round(logsSize / 1024)} KB`,
    };
  } catch (error) {
    console.error("Error getting storage info:", error);
    return { totalEntries: 0, dataSize: "0 KB", logsSize: "0 KB" };
  }
};

export { 
  addFoodLog, 
  getTodayProgress, 
  setTargetData, 
  getTargetData,
  getProgressForDateRange,
  getWeeklyProgress,
  performDataCleanup,
  clearAllData,
  getStorageInfo
};