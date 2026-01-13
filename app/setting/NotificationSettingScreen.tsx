import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Switch,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

function NotificationSettingScreen() {
    const router = useRouter();

    // State for toggles
    const [fareAlerts, setFareAlerts] = useState(true);
    const [routeUpdates, setRouteUpdates] = useState(true);
    const [communityActivity, setCommunityActivity] = useState(false);
    const [tipsAndInsight, setTipsAndInsight] = useState(true);

    const notificationItems = [
        {
            id: 'fareAlerts',
            title: 'Fare alert',
            description: 'Get notified when prices change',
            value: fareAlerts,
            onValueChange: setFareAlerts,
        },
        {
            id: 'routeUpdates',
            title: 'Route updates',
            description: 'Real-time traffic and road alerts',
            value: routeUpdates,
            onValueChange: setRouteUpdates,
        },
        {
            id: 'communityActivity',
            title: 'Community activity',
            description: 'When others confirm your route',
            value: communityActivity,
            onValueChange: setCommunityActivity,
        },
        {
            id: 'tipsAndInsight',
            title: 'Tips & insight',
            description: 'Smart suggestions from Ferify',
            value: tipsAndInsight,
            onValueChange: setTipsAndInsight,
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notification</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.listContainer}>
                    {notificationItems.map((item, index) => (
                        <View key={item.id} style={styles.listItem}>
                            <View style={styles.textContainer}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemDescription}>{item.description}</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#E0E0E0', true: '#000' }} // Black accent for premium feel
                                thumbColor={'#fff'}
                                ios_backgroundColor="#E0E0E0"
                                onValueChange={item.onValueChange}
                                value={item.value}
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 4,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    listContainer: {
        // paddingHorizontal: 20, 
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 13,
        color: '#666',
    },
});

export default NotificationSettingScreen;
