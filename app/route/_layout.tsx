import { Stack } from 'expo-router';

export default function RouteLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="RouteSelect"
                options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                    gestureEnabled: true,
                    gestureDirection: 'vertical',
                }}
            />
        </Stack>
    );
}
