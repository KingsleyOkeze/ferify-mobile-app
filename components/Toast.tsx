import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useToast, ToastType } from '@/contexts/ToastContext';

const { width } = Dimensions.get('window');

const getToastConfig = (type: ToastType) => {
    switch (type) {
        case 'success':
            return { image: require('../assets/images/toast-icons/success-icon.png'), color: '#4CAF50' };
        case 'error':
            return { image: require('../assets/images/toast-icons/error-icon.png'), color: '#F44336' };
        case 'badge':
            return { image: require('../assets/images/toast-icons/point-earned-icon.png'), color: '#FF9800' };
        case 'points':
            return { image: require('../assets/images/toast-icons/point-earned-icon.png'), color: '#2196F3' };
        case 'saved':
            return { image: require('../assets/images/toast-icons/input-saved-icon.png'), color: '#9C27B0' };
        case 'feature_update':
            return { image: require('../assets/images/toast-icons/feature-update-icon.png'), color: '#080808' };
        case 'general':
            return { image: require('../assets/images/toast-icons/general-icon.png'), color: '#080808' };
        default:
            return { image: require('../assets/images/toast-icons/success-icon.png'), color: '#080808' };
    }
};

export default function Toast() {
    const insets = useSafeAreaInsets();
    const { activeToast, hideToast } = useToast();
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (activeToast) {
            // Reset position if needed (to ensure clean start)
            slideAnim.setValue(-100);
            opacityAnim.setValue(0);

            // Parallel animation: Slide in + Fade in dim
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: insets.top + 10,
                    useNativeDriver: true,
                    tension: 40,
                    friction: 8
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                })
            ]).start();

            // Auto-hide
            const timer = setTimeout(() => {
                dismiss();
            }, activeToast.duration || 4000);

            return () => clearTimeout(timer);
        }
    }, [activeToast, insets.top]);

    const dismiss = () => {
        // Parallel animation: Slide out + Fade out dim
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -120,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true
            })
        ]).start(() => {
            hideToast();
        });
    };

    if (!activeToast) return null;

    const config = getToastConfig(activeToast.type);

    return (
        <View style={styles.overlayContainer}>
            {/* Background Dim */}
            <Animated.View
                style={[
                    styles.dimBackground,
                    {
                        opacity: opacityAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.3] // Light shadow as requested
                        })
                    }
                ]}
            />

            <View style={styles.safeArea}>
                <Animated.View
                    style={[
                        styles.container,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.content}>
                        {/* Left Icon */}
                        <View style={[styles.iconContainer, { backgroundColor: `${config.color}15` }]}>
                            <Image source={config.image as any} style={styles.icon} />
                        </View>

                        {/* Description */}
                        <View style={styles.textContainer}>
                            <Text style={styles.message} numberOfLines={2}>
                                {activeToast.message}
                            </Text>
                        </View>

                        {/* Right Cancel Icon */}
                        <TouchableOpacity onPress={dismiss} style={styles.closeButton}>
                            <Ionicons name="close" size={18} color="#080808" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 10000,
        pointerEvents: 'box-none',
    },
    dimBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#0A0A0A66',
    },
    safeArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        pointerEvents: 'box-none',
    },
    container: {
        width: width - 40,
        height: 72,
        alignSelf: 'center',
        backgroundColor: '#FBFBFB',
        borderRadius: 16,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.1,
        // shadowRadius: 10,
        // elevation: 6,
        borderWidth: 1,
        borderColor: '#FBFBFB',
    },
    icon: {
        width: 38,
        height: 38,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        fontSize: 16,
        fontWeight: 400,
        color: '#080808',
        fontFamily: 'BrittiRegular',
        lineHeight: 20,
    },
    closeButton: {
        padding: 4,
        marginLeft: 8,
        color: '#080808',
    },
});

