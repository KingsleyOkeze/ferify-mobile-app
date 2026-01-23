import { Stack } from "expo-router";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Platform } from "react-native";

function StackLayout() {
    const insets = useSafeAreaInsets();

    return (
        <View 
            style={{ 
                flex: 1, 
                backgroundColor: "#FBFBFB", 
                paddingTop: insets.top,
                paddingBottom: insets.bottom 
            }}
        >
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#FBFBFB" },
                }}
            >
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="route/RouteSelectScreen"
                    options={{
                        // On iOS, this gives you the "lower card" + "shrink" automatically
                        // Android: 'transparentModal' (allows us to see the home screen through the gap)
                        presentation: Platform.OS === 'ios' ? 'modal' : 'transparentModal', 
                        animation: "slide_from_bottom",
                        gestureEnabled: true,
                        // This property ensures the background color of the stack (black) 
                        // is visible during the animation
                        contentStyle: { 
                            backgroundColor: Platform.OS === 'android' ? 'transparent' : '#fff' 
                        },
                    }}
                />

                {/* Standard Modals */}
                <Stack.Screen name="contribution/MyContributionOverviewScreen" 
                    options={{
                        presentation: "modal",
                        animation: "slide_from_bottom",
                        gestureEnabled: true,
                        gestureDirection: "vertical",
                        fullScreenGestureEnabled: true,
                    }}
                />
                <Stack.Screen name="account/AccountAndPersonalMainScreen" 
                    options={{
                        presentation: "modal",
                        animation: "slide_from_bottom",
                        gestureEnabled: true,
                        gestureDirection: "vertical",
                        fullScreenGestureEnabled: true,
                    }}
                />
                <Stack.Screen name="setting/SettingMainScreen" 
                    options={{
                        presentation: "modal",
                        animation: "slide_from_bottom",
                        gestureEnabled: true,
                        gestureDirection: "vertical",
                        fullScreenGestureEnabled: true,
                    }}
                />
                <Stack.Screen name="help/HelpAndFeedbackScreen" 
                    options={{
                        presentation: "modal",
                        animation: "slide_from_bottom",
                        gestureEnabled: true,
                        gestureDirection: "vertical",
                        fullScreenGestureEnabled: true,
                    }}
                />
                <Stack.Screen name="about/AboutMainScreen" 
                    options={{
                        presentation: "modal",
                        animation: "slide_from_bottom",
                        gestureEnabled: true,
                        gestureDirection: "vertical",
                        fullScreenGestureEnabled: true,
                    }}
                />

                {/* Horizontal Modals */}
                <Stack.Screen name="contribution/AllContributionsScreen" 
                    options={{ 
                        presentation: "modal",
                        animation: "slide_from_right",
                        gestureEnabled: true,
                        gestureDirection: "horizontal", 
                    }} 
                />
                <Stack.Screen name="contribution/TrustAndReputationScreen" 
                    options={{ 
                        presentation: "modal",
                        animation: "slide_from_right",
                        gestureEnabled: true,
                        gestureDirection: "horizontal", 
                    }} 
                 />
                <Stack.Screen name="account/ProfileLandingScreen" 
                    options={{ 
                        presentation: "modal",
                        animation: "slide_from_right",
                        gestureEnabled: true,
                        gestureDirection: "horizontal", 
                    }} 
                />
                <Stack.Screen name="account/AccountDetailsScreen" 
                    options={{ 
                        presentation: "modal",
                        animation: "slide_from_right",
                        gestureEnabled: true,
                        gestureDirection: "horizontal", 
                    }} 
                />
                <Stack.Screen name="account/TransportPreferenceScreen" 
                    options={{ 
                        presentation: "modal",
                        animation: "slide_from_right",
                        gestureEnabled: true,
                        gestureDirection: "horizontal", 
                    }} 
                />
                <Stack.Screen name="account/AccountSecurityScreen" 
                    options={{ 
                        presentation: "modal",
                        animation: "slide_from_right",
                        gestureEnabled: true,
                        gestureDirection: "horizontal", 
                    }} 
                />
                <Stack.Screen name="setting/SecurityMainScreen" 
                    options={{ 
                        presentation: "modal",
                        animation: "slide_from_right",
                        gestureEnabled: true,
                        gestureDirection: "horizontal", 
                    }} 
                />
                <Stack.Screen name="setting/NotificationSettingScreen" 
                    options={{ 
                        presentation: "modal",
                        animation: "slide_from_right",
                        gestureEnabled: true,
                        gestureDirection: "horizontal", 
                    }} 
                />
                <Stack.Screen name="setting/Privacy&SafetySettingScreen" 
                    options={{ 
                        presentation: "modal",
                        animation: "slide_from_right",
                        gestureEnabled: true,
                        gestureDirection: "horizontal", 
                    }} 
                />
                <Stack.Screen name="help/PopularQuestionScreen" 
                    options={{ 
                        presentation: "modal",
                        animation: "slide_from_right",
                        gestureEnabled: true,
                        gestureDirection: "horizontal", 
                    }} 
                />
                <Stack.Screen name="help/AnswerToQuestionScreen" 
                    options={{ 
                        presentation: "modal",
                        animation: "slide_from_right",
                        gestureEnabled: true,
                        gestureDirection: "horizontal", 
                    }} 
                />
                <Stack.Screen name="help/SubmitFeedbackScreen" 
                    options={{ 
                        presentation: "modal",
                        animation: "slide_from_right",
                        gestureEnabled: true,
                        gestureDirection: "horizontal", 
                    }} 
                />
                <Stack.Screen name="about/AboutAppScreen" 
                    options={{ 
                        presentation: "modal",
                        animation: "slide_from_right",
                        gestureEnabled: true,
                        gestureDirection: "horizontal", 
                    }} 
                />
                <Stack.Screen name="about/AboutHowItWorksScreen" 
                    options={{ 
                        presentation: "modal",
                        animation: "slide_from_right",
                        gestureEnabled: true,
                        gestureDirection: "horizontal", 
                    }} 
                />
                <Stack.Screen name="achievement/AchievementsScreen" 
                    options={{ 
                        presentation: "modal",
                        animation: "slide_from_right",
                        gestureEnabled: true,
                        gestureDirection: "horizontal", 
                    }} 
                />
                <Stack.Screen name="achievement/BadgesScreen" 
                    options={{ 
                        presentation: "modal",
                        animation: "slide_from_right",
                        gestureEnabled: true,
                        gestureDirection: "horizontal", 
                    }} 
                />
                <Stack.Screen name="achievement/LeadershipBoardScreen" 
                    options={{ 
                        presentation: "modal",
                        animation: "slide_from_right",
                        gestureEnabled: true,
                        gestureDirection: "horizontal", 
                    }} 
                />
            </Stack>
        </View>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <StackLayout />
        </SafeAreaProvider>
    );
}


