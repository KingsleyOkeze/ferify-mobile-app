import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import axios from 'axios';
import { View, ActivityIndicator } from "react-native";
import { getToken } from "@/services/api";
import SplashScreen from "./auth/onboarding/SplashScreen";
import { fetchAndCacheLocation } from "@/services/locationService";
import { useFonts } from 'expo-font';
// import * as SplashScreen from 'expo-splash-screen';


// SplashScreen.preventAutoHideAsync();
axios.defaults.baseURL = process.env.EXPO_PUBLIC_SERVER_URL;

export default function Index() {
  const [fontsLoaded] = useFonts({
        BrittiRegular: require('../assets/fonts/BrittiSansTrial-Regular.ttf'),
        BrittiMedium: require('../assets/fonts/BrittiSansTrial-Medium.ttf'),
        BrittiBold: require('../assets/fonts/BrittiSansTrial-Bold.ttf'),
  });

  // if (!fontsLoaded) {
  //     SplashScreen.hideAsync();
  // }


  // const [isChecking, setIsChecking] = useState(true);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       // 1. Initial auth check
  //       const token = await getToken();
  //       setIsAuthenticated(!!token);

  //       // 2. Parallelize minimum splash time and situational location fetch
  //       await Promise.all([
  //         token ? fetchAndCacheLocation() : Promise.resolve(), // Silent refresh if authenticated
  //         new Promise((resolve) => setTimeout(resolve, 2000))
  //       ]);

  //     } catch (error) {
  //       setIsAuthenticated(false);
  //     } finally {
  //       setIsChecking(false);
  //     }
  //   };
  //   checkAuth();
  // }, []);

  // if (isChecking) {
  //   return <SplashScreen />;
  // }

  // return (
  //   <Redirect href={isAuthenticated ? "/tabs/HomeScreen" : "/auth/onboarding/OnboardingScreen"} />
  // );


  return (
    <Redirect href="/auth/signup/SignupScreen" />
  );
}
