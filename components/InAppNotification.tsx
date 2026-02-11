import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNotifications } from '@/contexts/NotificationContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function InAppNotification() {
    const { activeInAppNotification, clearInAppNotification } = useNotifications();
    const router = useRouter();
    const slideAnim = useRef(new Animated.Value(-150)).current;

    // Dynamic relative time
    const [relativeTime, setRelativeTime] = React.useState('Just now');

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 10) return 'Just now';
        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    // Update time every 10 seconds
    useEffect(() => {
        const updateTime = () => {
            if (activeInAppNotification) {
                setRelativeTime(formatRelativeTime(activeInAppNotification.createdAt));
            }
        };

        updateTime(); // Initial update
        const interval = setInterval(updateTime, 10000); // Update every 10 seconds

        return () => clearInterval(interval);
    }, [activeInAppNotification?.createdAt]);

    useEffect(() => {
        if (activeInAppNotification) {
            // Slide in
            Animated.spring(slideAnim, {
                toValue: 20,
                useNativeDriver: true,
                tension: 40,
                friction: 7
            }).start();

            // Auto-hide after 5 seconds
            const timer = setTimeout(() => {
                hide();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [activeInAppNotification]);

    const hide = () => {
        Animated.timing(slideAnim, {
            toValue: -150,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            clearInAppNotification();
        });
    };

    const handlePress = () => {
        hide();
        router.push('/notification/NotificationScreen');
    };

    if (!activeInAppNotification) return null;

    return (
        <SafeAreaView style={styles.safeArea}>
            <Animated.View
                style={[
                    styles.container,
                    { transform: [{ translateY: slideAnim }] }
                ]}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={handlePress}
                    style={styles.content}
                >
                    <View style={styles.header}>
                        <Text style={styles.brand}>Ferify</Text>
                        <Text style={styles.time}>{relativeTime}</Text>
                    </View>
                    <Text style={styles.title} numberOfLines={1}>
                        {activeInAppNotification.title}
                    </Text>
                    <Text style={styles.description} numberOfLines={2}>
                        {activeInAppNotification.description}
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        pointerEvents: 'box-none',
    },
    container: {
        width: width - 32,
        minHeight: 100,
        alignSelf: 'center',
        backgroundColor: '#FBFBFB',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        shadowColor: '#0A0A0A99',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 10,
        zIndex: 9999, // Ensure it's on top
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    brand: {
        fontSize: 18,
        fontWeight: 600,
        color: '#080808',
        fontFamily: 'BrittiBold',
    },
    time: {
        fontSize: 12,
        fontWeight: 400,
        color: '#6B6B6B',
        fontFamily: 'BrittiRegular',
    },
    title: {
        fontSize: 12,
        fontWeight: 400,
        color: '#080808',
        marginBottom: 6,
        fontFamily: 'BrittiRegular',
    },
    description: {
        fontSize: 12,
        fontWeight: 400,
        color: '#757575',
        fontFamily: 'BrittiRegular',
        lineHeight: 20,
    },
});
