import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    Image
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import api from '@/services/api';

function SavedRoutesScreen() {
    const router = useRouter();

    const [homeAddress, setHomeAddress] = useState('Add home address');
    const [workAddress, setWorkAddress] = useState('Add work address');
    const [isLoading, setIsLoading] = useState(true);

    const loadRoutes = async () => {
        setIsLoading(true);
        try {
            // Try to load from storage first for immediate display
            const storedHome = await AsyncStorage.getItem('home_address');
            const storedWork = await AsyncStorage.getItem('work_address');
            if (storedHome) setHomeAddress(storedHome);
            if (storedWork) setWorkAddress(storedWork);

            // Then fetch fresh data from backend
            const response = await api.get('/api/user/route/saved-routes');
            if (response.data && response.data.routes) {
                const routes = response.data.routes;
                const home = routes.find((r: any) => r.type === 'home');
                const work = routes.find((r: any) => r.type === 'work');

                if (home) {
                    setHomeAddress(home.address);
                    await AsyncStorage.setItem('home_address', home.address);
                } else {
                    setHomeAddress('Add home address');
                    await AsyncStorage.removeItem('home_address');
                }

                if (work) {
                    setWorkAddress(work.address);
                    await AsyncStorage.setItem('work_address', work.address);
                } else {
                    setWorkAddress('Add work address');
                    await AsyncStorage.removeItem('work_address');
                }
            }
        } catch (error) {
            console.error('Error loading saved routes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadRoutes();
        }, [])
    );

    const menuItems = [
        {
            id: 'home',
            title: 'Home',
            address: homeAddress === 'Add home address' ? '' : homeAddress,
            placeholder: 'Add home address',
            image: require('../../assets/images/saved-routes-icons/add_home_icon.png'),
            onPress: () => { router.push({ pathname: './AddRouteScreen', params: { type: 'home' } }) },
        },
        {
            id: 'work',
            title: 'Work',
            address: workAddress === 'Add work address' ? '' : workAddress,
            placeholder: 'Add work address',
            image: require('../../assets/images/saved-routes-icons/add_work_icon.png'),
            onPress: () => { router.push({ pathname: './AddRouteScreen', params: { type: 'work' } }) },
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Saved routes</Text>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#000" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.menuContainer}>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.menuItem,
                                    index === 0 && styles.firstMenuItem
                                ]}
                                onPress={item.onPress}
                            >
                                <View style={styles.itemLeft}>
                                    <View style={styles.iconCircle}>
                                        <Image source={item.image as any} style={styles.icon} />
                                    </View>
                                    <View>
                                        <Text style={styles.itemTitle}>{item.title}</Text>
                                        <Text style={[
                                            styles.itemAddress,
                                            !item.address && styles.placeholderText
                                        ]}>
                                            {item.address || item.placeholder}
                                        </Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#999" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFB',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 4,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    menuContainer: {
        paddingTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    firstMenuItem: {
        // borderTopWidth: 1,
        // borderTopColor: '#F0F0F0',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    icon: {
        width: 44,
        height: 44,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    itemAddress: {
        fontSize: 14,
        color: '#000',
        marginTop: 2,
        maxWidth: '90%',
    },
    placeholderText: {
        color: '#999',
    },
});

export default SavedRoutesScreen;
