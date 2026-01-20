import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import axios from 'axios';
import { View, ActivityIndicator } from "react-native";
import { getToken } from "@/services/api";
import SplashScreen from "./auth/onboarding/SplashScreen";
import { fetchAndCacheLocation } from "@/services/locationService";

axios.defaults.baseURL = process.env.EXPO_PUBLIC_SERVER_URL;

export default function Index() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Initial auth check
        const token = await getToken();
        setIsAuthenticated(!!token);

        // 2. Parallelize minimum splash time and situational location fetch
        await Promise.all([
          token ? fetchAndCacheLocation() : Promise.resolve(), // Silent refresh if authenticated
          new Promise((resolve) => setTimeout(resolve, 2000))
        ]);

      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, []);

  if (isChecking) {
    return <SplashScreen />;
  }

  return (
    <Redirect href={isAuthenticated ? "/tabs/HomeScreen" : "/auth/onboarding/OnboardingScreen"} />
  );


  // return (
  //   <Redirect href="./auth/signup/VerifySignupEmailScreen" />
  // );
}
