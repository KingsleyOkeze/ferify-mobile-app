import { Tabs } from 'expo-router';
import {Ionicons, MaterialIcons, Feather, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

function TabsLayout() {
    return (
        <>
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
                        // backgroundColor: 'red'
                    },
                }}
            >
                <Tabs.Screen
                    name="HomeScreen"
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="home" size={24} color={color} />
                        ),
                        tabBarLabel: 'Home',
                    }}
                />
                <Tabs.Screen
                    name="DiscoverScreen"
                    options={{
                        tabBarIcon: ({ color }) => (
                            <View>
                                <MaterialIcons name="explore" size={24} color={color} />
                            </View>
                        ),
                        tabBarLabel: 'Discover',
                    }}
                />
                <Tabs.Screen
                    name="AccountScreen"
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="account-circle" size={24} color={color} />
                        ),
                        tabBarLabel: 'Account',
                    }}
                />
            </Tabs>

        </>
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
});

export default TabsLayout;