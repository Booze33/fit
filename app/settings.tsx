import {
    View,
    Text,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    Button
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { setTargetData } from "@/lib/actions/data.action";
  
  const SettingsScreen = () => {
    const [calorie, setCalorie] = useState("");
    const [protein, setProtein] = useState("");
    const [loading, setLoading] = useState(false);
  
    const handleSaveSettings = async () => {
      const calorieNum = parseFloat(calorie);
      const proteinNum = parseFloat(protein);
  
      if (isNaN(calorieNum) || calorieNum <= 0) {
        Alert.alert("Invalid Input", "Please enter a valid calorie target.");
        return;
      }
  
      if (isNaN(proteinNum) || proteinNum <= 0) {
        Alert.alert("Invalid Input", "Please enter a valid protein target.");
        return;
      }
  
      try {
        setLoading(true);
        await setTargetData(calorieNum, proteinNum);
        Alert.alert("Success", `Settings Saved!\nCalorie Target: ${calorieNum}\nProtein Target: ${proteinNum}g`);
      } catch (error) {
        console.error("Failed to save settings:", error);
        Alert.alert("Error", "Failed to save settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <TextInput
          style={styles.input}
          value={calorie}
          onChangeText={setCalorie}
          placeholder="Daily Calorie Target (kcal):"
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          value={protein}
          onChangeText={setProtein}
          placeholder="Daily Protein Target (g):"
          keyboardType="numeric"
        />

        <Button title="Save Settings" onPress={handleSaveSettings} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#fff",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    inputContainer: {
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
    },
    input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 15,
      paddingHorizontal: 10,
    },
    saveButton: {
      backgroundColor: "#2563EB",
      padding: 15,
      borderRadius: 5,
      alignItems: "center",
      marginTop: 10,
    },
    saveButtonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
  });
  
  export default SettingsScreen;
  