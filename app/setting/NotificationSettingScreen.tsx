import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import CustomSwitch from '@/components/CustomSwitch';

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
        // {
        //     id: 'routeUpdates',
        //     title: 'Route updates',
        //     description: 'Real-time traffic and road alerts',
        //     value: routeUpdates,
        //     onValueChange: setRouteUpdates,
        // },
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
                            <CustomSwitch
                                value={item.value}
                                onValueChange={item.onValueChange}
                                trackColor={{ false: '#E3E3E3', true: '#080808' }}
                                thumbColor={'#FFFFFF'}
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
        backgroundColor: '#FBFBFB',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    listContainer: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#DADADA',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // paddingVertical: 20,
        // paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        height: 87,
        paddingHorizontal: 20,
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#757575',
    },
    switch: {
        height: 40
    }
});

export default NotificationSettingScreen;
