import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Import custom PNG icons
const homeOn = require('../../assets/images/bottom-tab-icons/home_on_view_icon.png');
const homeOff = require('../../assets/images/bottom-tab-icons/home_not_on_view_icon.png');
const discoverOn = require('../../assets/images/bottom-tab-icons/discover_on_view_icon.png');
const discoverOff = require('../../assets/images/bottom-tab-icons/discover_not_on_view_icon.png');
const accountOn = require('../../assets/images/bottom-tab-icons/account_on_view_icon.png');
const accountOff = require('../../assets/images/bottom-tab-icons/account_not_on_view_icon.png');


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
                        fontWeight: '600',
                        marginTop: 8, // 8px gap between icon and name
                    },
                    tabBarIconStyle: {
                        marginTop: 10,
                    },
                    tabBarStyle: {
                        height: 90,
                        paddingBottom: 24, // Adjusted to accommodate label margin
                        position: 'relative',
                        backgroundColor: '#FFFFFF',
                        borderTopWidth: 1,
                        borderTopColor: '#F2F2F2',
                    },
                }}
            >
                <Tabs.Screen
                    name="HomeScreen"
                    options={{
                        tabBarIcon: ({ focused }: { focused: boolean }) => (
                            <Image
                                source={focused ? homeOn : homeOff}
                                style={{ width: 20, height: 20 }}
                                resizeMode="contain"
                            />
                        ),
                        tabBarLabel: 'Home',
                    }}
                />
                <Tabs.Screen
                    name="DiscoverScreen"
                    options={{
                        tabBarIcon: ({ focused }: { focused: boolean }) => (
                            <Image
                                source={focused ? discoverOn : discoverOff}
                                style={{ width: 20, height: 20 }}
                                resizeMode="contain"
                            />
                        ),
                        tabBarLabel: 'Discover',
                    }}
                />
                <Tabs.Screen
                    name="AccountScreen"
                    options={{
                        tabBarIcon: ({ focused }: { focused: boolean }) => (
                            <Image
                                source={focused ? accountOn : accountOff}
                                style={{ width: 20, height: 20 }}
                                resizeMode="contain"
                            />
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