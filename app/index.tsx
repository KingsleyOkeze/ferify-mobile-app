import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import axios from 'axios';
import { View, ActivityIndicator } from "react-native";
import { getToken } from "@/services/api";
import SplashScreen from "./auth/SplashScreen";

axios.defaults.baseURL = process.env.EXPO_PUBLIC_SERVER_URL;

export default function Index() {
  // const [isChecking, setIsChecking] = useState(true);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       // 1. Show Splash for at least 2 seconds
  //       await new Promise((resolve) => setTimeout(resolve, 2000));

  //       // 2. Then check for token
  //       const token = await getToken();
  //       setIsAuthenticated(!!token);
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
  //   <Redirect href={isAuthenticated ? "/tabs/HomeScreen" : "/auth/OnboardingScreen"} />
  // );


  return (
    <Redirect href="/tabs/HomeScreen" />
  );
}
