import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  Image, 
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView 
} from "react-native";
import './global.css';
import { router } from 'expo-router';
import ProgessBar from "../components/ProgessBar";
import { getTodayProgress, getTargetData } from "../lib/actions/data.action";
import { useEffect, useState } from "react";
import { Plus, Settings, Calendar } from 'lucide-react-native';

const HomeScreen = () => {
  const [food, setFood] = useState([]);
  const [calorie, setCalorie] = useState(0);
  const [protein, setProtein] = useState(0);
  const [calorieTarget, setCalorieTarget] = useState(0);
  const [proteinTarget, setProteinTarget] = useState(0);
  const [calorieProgress, setCalorieProgress] = useState(0);
  const [proteinProgress, setProteinProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todayProgress = await getTodayProgress();
        const targetData = await getTargetData();

        console.log("Today's Progress:", todayProgress);
        console.log("Target Data:", targetData);

        if (todayProgress && targetData) {
          const caloriePercentage = (todayProgress.totalCalories / targetData.targetCalories) * 100;
          const proteinPercentage = (todayProgress.totalProtein / targetData.targetProtein) * 100;

          setCalorie(todayProgress.totalCalories);
          setProtein(todayProgress.totalProtein);

          setCalorieTarget(targetData.targetCalories);
          setProteinTarget(targetData.targetProtein);

          setCalorieProgress(caloriePercentage);
          setProteinProgress(proteinPercentage);
          setFood(todayProgress.todaysLogs || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Could not fetch nutrition data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navigateToAddFood = () => {
    router.push('/add_food');
  };

  const navigateToSettings = () => {
    router.push('/settings');
  };

  const navigateToHistory = () => {
    router.push('/history');
  };

  if (loading) {
    return (
      <SafeAreaView className="flex items-center justify-center w-[100vw] h-[100vh] bg-[#fff]">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex items-center pt-[3rem] w-[100vw] h-[100vh] bg-[#fff]">
      <Text className='font-bold text-2xl'>My Nutrition Tracker</Text>
      <View className="w-[80%] mt-8 text-gray-800">
        <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-md font-light text-gray-800">Calories Progress:</Text>
          <Text className="text-md font-light text-gray-800">{calorie}/{calorieTarget}kCal</Text>
        </View>
        <ProgessBar progress={calorieProgress} />
        <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-md font-light text-gray-800">Protein Progress:</Text>
          <Text className="text-md font-light text-gray-800">{protein}/{proteinTarget}kg</Text>
        </View>
        <ProgessBar progress={proteinProgress} />
      </View>
      <TouchableOpacity onPress={navigateToAddFood} className="flex flex-row px-[1rem] py-[0.4rem] justify-center items-center text-[#fff] bg-blue-500 hover:bg-blue-600 rounded-md w-[80%] h-[2rem] mt-0">
        <Plus color={"#fff"} />
        <Text className="text-[#fff] font-semi-bold text-md ml-2">Add Food</Text>
      </TouchableOpacity>

      {food.length > 0 && (
        <View className="w-[80%] mt-4">
          <Text className="text-md font-semibold text-gray-800">Today's Food Log:</Text>
          {food.map((item, index) => (
            <View key={index} className="flex flex-row justify-between items-center w-full mt-4 border-b border-gray-200 py-2">
              <Text className="text-md font-light text-gray-800">{item.food}</Text>
              <Text className="text-md font-light text-gray-800">{item.calories}kCal</Text>
            </View>
          ))}
        </View>
      )}

      <View className="flex flex-row w-[80vw] justify-around mt-4">
        <TouchableOpacity onPress={navigateToHistory} className="flex flex-row px-[0.4rem] py-[0.2em] justify-center items-center bg-gray-200 hover:bg-gray-300 rounded-md w-[40%] h-[2rem] mt-4">
          <Calendar color={"#1F2937"} size={18} />
          <Text className="text-gray-800 font-semi-bold text-md ml-2">History</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToSettings} className="flex flex-row px-[0.4rem] py-[0.2rem] justify-center items-center bg-gray-200 hover:bg-gray-300 rounded-md w-[40%] h-[2rem] mt-4">
          <Settings color={"#1F2937"} size={18} />
          <Text className="text-gray-800 font-semi-bold text-sm ml-2">Settings</Text>
        </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}

export default HomeScreen;