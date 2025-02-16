import { API_URL } from "@/config";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthResponse {
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  message?: string;
}

export const SignIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to sign in");
    }

    const data: AuthResponse = await response.json();

    if (data.token) {
      try {
        await AsyncStorage.setItem('token', data.token);
        console.log('Token stored:', data.token);
      } catch (storeError) {
        console.error('Error storing token:', storeError);
        throw new Error('Unable to store authentication token');
      }
    } else {
      console.error("No tole received from the backend");
      throw new Error("Authentication failed");
    }

    return data;
  } catch (error) {
    console.error("Sign in error:", error);
      throw error;
  }
}

export const SignUp = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to sign up")
    }

    const data: AuthResponse = await response.json();

    if (data.token) {
      try {
        await AsyncStorage.setItem('token', data.token);
        console.log('Token stored:', data.token);
      } catch (storeError) {
        console.error('Error storing token:', storeError);
        throw new Error('Unable to store authentication token');
      }
    } else {
      console.error("No tole received from the backend");
      throw new Error("Authentication failed");
    }

    return data;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
}

export const signOut = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('token');
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Failed to log out");
  }
};

export const GetLoggedInUser = async (): Promise<AuthResponse['user'] | null> => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      console.log("No authentication token found");
      return null;
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("Failed to fetch user data");
      return null;
    }

    const userData: AuthResponse = await response.json();
    return userData.user || null;
  } catch (error) {
    console.error("Error fetching logged-in user:", error);
    return null;
  }
};