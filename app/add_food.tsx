import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { addFoodLog } from '../lib/actions/data.action';

export default function AddFoodScreen() {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');

  const handleAddFood = async () => {
    if (food && calories && protein) {
      try {
        await addFoodLog({ food, calories: parseInt(calories), protein: parseInt(protein) });
        router.back();
      } catch (error) {
        console.error('Failed to add food log:', error);
        // Optionally, display an error message to the user
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Food Log</Text>
      <TextInput
        style={styles.input}
        placeholder="Food"
        value={food}
        onChangeText={setFood}
      />
      <TextInput
        style={styles.input}
        placeholder="Calories"
        keyboardType="numeric"
        value={calories}
        onChangeText={setCalories}
      />
      <TextInput
        style={styles.input}
        placeholder="Protein (g)"
        keyboardType="numeric"
        value={protein}
        onChangeText={setProtein}
      />
      <Button title="Add Food" onPress={handleAddFood} />
    </View>
  );
}

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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});