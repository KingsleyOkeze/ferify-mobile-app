import { Tabs } from 'expo-router';
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { HomeIcon, DiscoverIcon, AccountIcon } from '@/components/icons/CustomIcons';
import { useRouter, usePathname } from 'expo-router';


function TabsLayout() {
    const router = useRouter();
    const pathname = usePathname();

    // Only show FAB on Home and Discover screens
    const showFab = pathname === '/' || pathname === '/DiscoverScreen' || pathname === '/HomeScreen';

    return (
        <View style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: true,
                    tabBarLabelPosition: 'below-icon',
                    tabBarActiveTintColor: '#080808',
                    tabBarInactiveTintColor: '#646464',
                    tabBarLabelStyle: {
                        fontFamily: 'BrittiSemibold',
                        fontSize: 12,
                        fontWeight: 600,
                        // color: '#646464',
                    },
                    tabBarStyle: {
                        height: 90,
                        paddingBottom: 4,
                        position: 'relative',
                    },
                }}
            >
                <Tabs.Screen
                    name="HomeScreen"
                    options={{
                        tabBarIcon: ({ color }) => (
                            <HomeIcon size={24} color={color} />
                        ),
                        tabBarLabel: 'Home',
                    }}
                />
                <Tabs.Screen
                    name="DiscoverScreen"
                    options={{
                        tabBarIcon: ({ color }) => (
                            <View>
                                <DiscoverIcon size={24} color={color} />
                            </View>
                        ),
                        tabBarLabel: 'Discover',
                    }}
                />
                <Tabs.Screen
                    name="AccountScreen"
                    options={{
                        tabBarIcon: ({ color }) => (
                            <AccountIcon size={24} color={color} />
                        ),
                        tabBarLabel: 'Account',
                    }}
                />
            </Tabs>

            {showFab && (
                <TouchableOpacity
                    style={styles.fab}
                    activeOpacity={0.7}
                    onPress={() => {
                        requestAnimationFrame(() => {
                            router.push('/fare-contribution/FareContributionScreen');
                        });
                    }}
                >
                    <Ionicons name="add" size={24} color="#FFF" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        right: -6,
        top: -4,
        backgroundColor: 'red',
        borderRadius: 10,
        minWidth: 16,
        minHeight: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#646464',
        fontSize: 10,
        fontWeight: 'bold',
    },
    fab: {
        position: 'absolute',
        bottom: 100, // Positioned above the tab bar (height 90 + 10 margin)
        right: 16,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
});

export default TabsLayout;