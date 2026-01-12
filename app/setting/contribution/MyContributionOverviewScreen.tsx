import React from 'react';
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

function MyContributionOverviewScreen() {
    const router = useRouter();

    const stats = [
        { id: 1, title: 'Contribution points', emoji: '🏆', value: '1,250' },
        { id: 2, title: 'People helped', emoji: '👥', value: '342' },
        { id: 3, title: 'Routes confirmed', emoji: '✅', value: '85' },
        { id: 4, title: 'Fair updated', emoji: '💰', value: '12' },
    ];

    const menuItems = [
        {
            id: 'achievement',
            title: 'Achievement',
            description: 'Badges and milestones earned',
            icon: 'ribbon-outline',
            onPress: () => { },
        },
        {
            id: 'contributions',
            title: 'My contributions',
            description: 'History of your shared data',
            icon: 'list-outline',
            onPress: () => { },
        },
        {
            id: 'trust',
            title: 'Trust and reputation',
            description: 'Your standing in the community',
            icon: 'shield-checkmark-outline',
            onPress: () => { },
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My contributions</Text>
                <Text style={styles.headerSubtitle}>See how you're helping the community</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {stats.map((stat) => (
                        <View key={stat.id} style={styles.statCard}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardEmoji}>{stat.emoji}</Text>
                                <Text style={styles.cardTitle}>{stat.title}</Text>
                            </View>
                            <Text style={styles.cardValue}>{stat.value}</Text>
                        </View>
                    ))}
                </View>

                {/* Menu List */}
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
                                <Ionicons name={item.icon as any} size={24} color="#333" style={styles.itemIcon} />
                                <View style={styles.textContainer}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <Text style={styles.itemDescription}>{item.description}</Text>
                                </View>
                            </View>
                            {/* Arrow without tail - Chevron Forward matches description best */}
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    statCard: {
        width: '48%', // Two cards per row with gap
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        height: 100, // Fixed height for consistency
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardEmoji: {
        fontSize: 18,
        marginRight: 6,
    },
    cardTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        flex: 1, // Allow text to wrap if needed
    },
    cardValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        alignSelf: 'flex-end', // Align number to right end
    },
    menuContainer: {
        // paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    firstMenuItem: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemIcon: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
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

export default MyContributionOverviewScreen;
