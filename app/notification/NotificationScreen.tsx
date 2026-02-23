import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    StatusBar,
    ActivityIndicator,
    Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useNotifications, Notification } from '@/contexts/NotificationContext';

export default function NotificationScreen() {
    const router = useRouter();
    const { notifications, loading, markAllAsRead, fetchNotifications } = useNotifications();

    useEffect(() => {
        fetchNotifications();

        // Mark all as read when user leaves the screen (industry standard)
        return () => {
            markAllAsRead();
        };
    }, []);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    const getIconForType = (type: Notification['type']) => {
        if (type === 'fare_verified') {
            return { image: require('../../assets/images/notification-icons/fare_verified_icon.png') };
        }
        if (type === 'fare_confirmed') {
            return { image: require('../../assets/images/notification-icons/fare-verified-icon.png') };
        }
        if (type === 'points_earned') {
            return { image: require('../../assets/images/notification-icons/badge-point-icon.png') };
        }
        if (type === 'feature_update') {
            return { image: require('../../assets/images/notification-icons/new-feature-update-icon.png') };
        }
        // if (type === 'earned_badge') {
        //     return { image: require('../../assets/images/notification-icons/earned_badge_icon.png') };
        // }
        // Default for 'general' and any other types
        return { image: require('../../assets/images/notification-icons/new-feature-update-icon.png') };
    };

    const renderItem = ({ item, index }: { item: Notification; index: number }) => {
        const iconCfg = getIconForType(item.type);

        return (
            <View style={[
                styles.notificationItem,
                index === 0 && styles.firstItem,
                !item.isRead && styles.unreadItem
            ]}>
                <View style={styles.iconContainer}>
                    <Image source={iconCfg.image} style={styles.iconImage} resizeMode="contain" />
                    {!item.isRead && <View style={styles.unreadIndicator} />}
                </View>
                <View style={styles.textSection}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                    <Text style={styles.itemTime}>{formatTime(item.createdAt)}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#080808" />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Notification</Text>
            </View>

            {/* List */}
            {loading && notifications.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#080808" />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="notifications-off-outline" size={60} color="#DADADA" />
                            <Text style={styles.emptyText}>No notifications yet</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFB',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 600,
        color: '#080808',
        fontFamily: 'BrittiSemibold',
        paddingTop: 10,
        paddingBottom: 10
    },
    listContent: {
        paddingBottom: 30,
        flexGrow: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationItem: {
        flexDirection: 'row',
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E9E9E9',
        backgroundColor: '#FFFFFF',
        minHeight: 142,
    },
    unreadItem: {
        backgroundColor: '#F0F7FF', // Subtle light blue highlight
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    firstItem: {
        borderTopWidth: 1,
        borderTopColor: '#E9E9E9',
    },
    unreadIndicator: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FF3B30',
        borderWidth: 2,
        borderColor: '#F0F7FF',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    iconImage: {
        width: 40,
        height: 40,
    },
    textSection: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#080808',
        marginBottom: 4,
        fontFamily: 'BrittiSemibold',
        paddingBottom: 5
    },
    itemDescription: {
        fontSize: 14,
        fontWeight: 400,
        color: '#757575',
        marginBottom: 15,
        lineHeight: 20,
        fontFamily: 'BrittiRegular',
    },
    itemTime: {
        fontSize: 12,
        fontWeight: 400,
        color: '#6B6B6B',
        fontFamily: 'BrittiRegular',
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#757575',
        fontFamily: 'BrittiRegular',
    },
});
