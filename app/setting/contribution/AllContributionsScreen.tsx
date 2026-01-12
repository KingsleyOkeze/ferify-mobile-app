import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

// Enable LayoutAnimation for Android
if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TabType = 'fares' | 'routes' | 'reports';

function AllContributionsScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('fares');

    const tabs: { id: TabType; label: string }[] = [
        { id: 'fares', label: 'Fares' },
        { id: 'routes', label: 'Routes' },
        { id: 'reports', label: 'Reports' },
    ];

    const handleTabPress = (tabId: TabType) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActiveTab(tabId);
    };

    // Dummy Data Generators
    const generateHistoryData = (type: TabType) => {
        const commonData = [
            {
                dateGroup: 'Today',
                items: [
                    { id: '1', from: 'Oshodi', to: 'Ikeja', time: '3:55pm', points: '+80 points' },
                    { id: '2', from: 'Yaba', to: 'Victoria Island', time: '1:20pm', points: '+50 points' },
                    { id: '3', from: 'Lekki', to: 'Ajah', time: '9:45am', points: '+60 points' },
                    { id: '4', from: 'Ikorodu', to: 'Mike 12', time: '7:15am', points: '+70 points' },
                ]
            },
            {
                dateGroup: 'Yesterday',
                items: [
                    { id: '5', from: 'Berger', to: 'Obalende', time: '5:30pm', points: '+40 points' },
                    { id: '6', from: 'Iyana Ipaja', to: 'Oshodi', time: '8:00am', points: '+45 points' },
                ]
            },
            {
                dateGroup: '2 days ago',
                items: [
                    { id: '7', from: 'Maryland', to: 'Ojota', time: '4:10pm', points: '+30 points' },
                ]
            }
        ];

        // Augment data based on type
        return commonData.map(group => ({
            ...group,
            items: group.items.map(item => {
                if (type === 'fares') {
                    return { ...item, price: '₦400 - ₦500', icon: 'bus-outline' }; // Bus icon placeholder
                } else if (type === 'routes') {
                    return { ...item, icon: 'map-outline' };
                } else {
                    return { ...item, issue: 'Traffic Congestion', icon: 'warning-outline' };
                }
            })
        }));
    };

    const currentData = generateHistoryData(activeTab);

    const getTitle = () => {
        if (activeTab === 'fares') {
            return 'Fares';
        } else if (activeTab === 'routes') {
            return 'Routes';
        } else if (activeTab === 'reports') {
            return 'Reports';
        }
        return 'Fares';
    };

    const renderCardContent = (item: any) => {
        if (activeTab === 'fares') {
            return (
                <View style={styles.cardContent}>
                    <Text style={styles.cardMainText}>{item.from} - {item.to}</Text>
                    <Text style={styles.cardSubText}>{item.price}</Text>
                    <Text style={styles.cardTimeText}>{item.time}</Text>
                </View>
            );
        } else if (activeTab === 'routes') {
            return (
                <View style={styles.cardContent}>
                    <Text style={styles.cardMainText}>{item.from} - {item.to}</Text>
                    <View style={styles.spacer} />
                    <Text style={styles.cardTimeText}>{item.time}</Text>
                </View>
            );
        } else {
            // Reports
            return (
                <View style={styles.cardContent}>
                    <Text style={[styles.cardMainText, styles.reportIssueText]}>{item.issue}</Text>
                    <Text style={styles.cardSubText}>{item.from} - {item.to}</Text>
                    <Text style={styles.cardTimeText}>{item.time}</Text>
                </View>
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{getTitle()}</Text>
                <TouchableOpacity onPress={() => router.dismiss()} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        style={styles.tabItem}
                        onPress={() => handleTabPress(tab.id)}
                    >
                        <Text style={[
                            styles.tabLabel,
                            activeTab === tab.id && styles.activeTabLabel
                        ]}>
                            {tab.label}
                        </Text>
                        {activeTab === tab.id && <View style={styles.activeTabIndicator} />}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content List */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {currentData.map((group, groupIndex) => (
                    <View key={groupIndex} style={styles.groupContainer}>
                        <Text style={styles.dateHeader}>{group.dateGroup}</Text>

                        {group.items.map((item, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.card,
                                    index === 0 && styles.firstCard
                                ]}
                            >
                                {/* Left Icon/Image */}
                                <View style={styles.iconContainer}>
                                    <Ionicons name={item.icon as any} size={24} color="#333" />
                                </View>

                                {/* Middle Content */}
                                {renderCardContent(item)}

                                {/* Right Points */}
                                <View style={styles.pointsContainer}>
                                    <Text style={styles.pointsText}>{item.points}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ))}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    headerButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingHorizontal: 20,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 14,
    },
    tabLabel: {
        fontSize: 16,
        color: '#999',
        fontWeight: '500',
    },
    activeTabLabel: {
        color: '#000',
        fontWeight: 'bold',
    },
    activeTabIndicator: {
        position: 'absolute',
        bottom: 0,
        width: '60%',
        height: 3,
        backgroundColor: '#000',
        borderRadius: 2,
    },
    scrollContent: {
        paddingBottom: 40,
        paddingTop: 20,
    },
    groupContainer: {
        marginBottom: 24,
    },
    dateHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginLeft: 20,
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        backgroundColor: '#fff',
    },
    firstCard: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    cardMainText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 2,
    },
    reportIssueText: {
        color: '#E53935', // Red for issues
    },
    cardSubText: {
        fontSize: 14,
        color: '#444',
        marginBottom: 2,
    },
    cardTimeText: {
        fontSize: 12,
        color: '#999',
    },
    spacer: {
        height: 4,
    },
    pointsContainer: {
        marginLeft: 10,
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    pointsText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2E7D32', // Green
    },
});

export default AllContributionsScreen;
