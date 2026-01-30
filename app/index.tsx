import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import axios from 'axios';
import { getToken } from "@/services/api";
import { fetchAndCacheLocation } from "@/services/locationService";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
// Import your custom design directly
import MyCustomSplashScreen from "./auth/onboarding/SplashScreen";

SplashScreen.preventAutoHideAsync();

axios.defaults.baseURL = process.env.EXPO_PUBLIC_SERVER_URL;

export default function Index() {
    const [fontsLoaded, fontError] = useFonts({
        BrittiBold: require('../assets/fonts/BrittiSansTrial-Bold-BF6757bfd4a96ed.otf'),
        BrittiBoldItalic: require('../assets/fonts/BrittiSansTrial-BoldItalic-BF6757bfd4a2285.otf'),
        BrittiLight: require('../assets/fonts/BrittiSansTrial-Light-BF6757bfd494951.otf'),
        BrittiLightItalic: require('../assets/fonts/BrittiSansTrial-LightItalic-BF6757bfd48c7c7.otf'),
        BrittiRegular: require('../assets/fonts/BrittiSansTrial-Regular-BF6757bfd47ffbf.otf'),
        BrittiRegularItalic: require('../assets/fonts/BrittiSansTrial-RegularItalic-BF6757bfd44e013.otf'),
        BrittiSemibold: require('../assets/fonts/BrittiSansTrial-Semibold-BF6757bfd443a8a.otf'),
        BrittiSemiboldItalic: require('../assets/fonts/BrittiSansTrial-SemiboldItalic-BF6757bfd411c3a.otf'),
    });

    const [isReady, setIsReady] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        async function loadApp() {
            try {
                const token = await getToken();
                setIsAuthenticated(!!token);

                if (token) {
                    await fetchAndCacheLocation();
                }

                // Keep the custom splash visible for 2 seconds
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (e) {
                console.error("Initialization Error:", e);
            } finally {
                setIsReady(true);
                // Hide the NATIVE splash (image from app.json)
                if (fontsLoaded || fontError) {
                    await SplashScreen.hideAsync();
                }
            }
        }

        loadApp();
    }, [fontsLoaded, fontError]);

    // Stage 1: Native Splash (shows while fonts are loading)
    if (!fontsLoaded && !fontError) return null;

    // Stage 2: Custom Splash (shows while auth/location is being checked)
    if (!isReady) {
        return <MyCustomSplashScreen />;
    }

    // Stage 3: Final Destination
    // return (
    //     <Redirect 
    //         href={isAuthenticated ? "/(tabs)/HomeScreen" : "/auth/onboarding/OnboardingScreen"} 
    //     />
    // );

    return (
        // <Redirect href="./route/RouteResultScreen" />
        <Redirect href="./auth/login/LoginScreen" />
    );
}