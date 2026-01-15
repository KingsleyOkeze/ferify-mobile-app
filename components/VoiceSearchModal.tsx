import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withDelay,
    Easing,
    cancelAnimation,
    withSequence,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface VoiceSearchModalProps {
    visible: boolean;
    onClose: () => void;
}

const PulseCircle = ({ delay = 0 }: { delay?: number }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.6);

    useEffect(() => {
        // user requested: "red lick wave to be showing around the mic after like a sec"
        // we add 1000ms base delay to the pulses
        const baseDelay = 1000;

        scale.value = withDelay(
            baseDelay + delay,
            withRepeat(
                withTiming(2.2, {
                    duration: 1800,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                }),
                -1,
                false
            )
        );
        opacity.value = withDelay(
            baseDelay + delay,
            withRepeat(
                withTiming(0, {
                    duration: 1800,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                }),
                -1,
                false
            )
        );

        return () => {
            cancelAnimation(scale);
            cancelAnimation(opacity);
        };
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return <Animated.View style={[styles.pulseCircle, animatedStyle]} />;
};

export default function VoiceSearchModal({ visible, onClose }: VoiceSearchModalProps) {
    const router = useRouter();
    const [status, setStatus] = useState<'listening' | 'processing'>('listening');

    // Spinner animation for processing state
    const rotation = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            setStatus('listening');
            // Simulate switching to processing after 4 seconds (1s wait + 3s listening)
            const timer = setTimeout(() => {
                setStatus('processing');
                rotation.value = 0;
                rotation.value = withRepeat(
                    withTiming(360, {
                        duration: 800,
                        easing: Easing.linear,
                    }),
                    -1,
                    false
                );
            }, 4000);

            return () => {
                clearTimeout(timer);
                cancelAnimation(rotation);
            };
        } else {
            setStatus('listening');
            cancelAnimation(rotation);
        }
    }, [visible]);

    useEffect(() => {
        if (status === 'processing' && visible) {
            // After user stop talking, processing starts, then lead to route select
            const timer = setTimeout(() => {
                onClose();
                router.push("/route/RouteSelect");
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [status, visible]);

    const spinnerStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalCard}>
                    {/* Stage for animations - Mic at the top */}
                    <View style={styles.micStage}>
                        {status === 'listening' ? (
                            <>
                                <PulseCircle delay={0} />
                                <PulseCircle delay={800} />

                                <View style={styles.micCircle}>
                                    <Ionicons name="mic" size={32} color="#fff" />
                                </View>
                            </>
                        ) : (
                            <View style={styles.processingWrapper}>
                                {/* Spinner Track (Light Grey Circle) */}
                                <View style={styles.spinnerTrack} />

                                {/* Spinner Segment (Black "Snake") */}
                                <Animated.View style={[styles.spinnerOverlay, spinnerStyle]}>
                                    <View style={styles.spinnerSegment} />
                                </Animated.View>

                                <View style={[styles.micCircle, { backgroundColor: '#F9F9F9', elevation: 0, shadowOpacity: 0 }]}>
                                    <Ionicons name="mic" size={32} color="#080808" />
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Text Section */}
                    <View style={styles.textSection}>
                        <Text style={[
                            styles.statusText,
                            status === 'listening' ? styles.redText : styles.blackText
                        ]}>
                            {status === 'listening' ? 'Listening...' : 'Processing...'}
                        </Text>

                        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                            <Text style={styles.cancelText}>Tap to cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Darker overlay for card focus
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        width: 241,
        height: 217,
        backgroundColor: '#fff',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        // Premium shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    micStage: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    processingWrapper: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    micCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
    },
    pulseCircle: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FF3B30',
        zIndex: 1,
    },
    spinnerTrack: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#E0E0E0',
        zIndex: 2,
    },
    spinnerOverlay: {
        position: 'absolute',
        width: 80,
        height: 80,
        zIndex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinnerSegment: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: 'transparent',
        borderTopColor: '#080808', // The "snake" segment
    },
    textSection: {
        alignItems: 'center',
    },
    statusText: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    redText: {
        color: '#FF3B30',
    },
    blackText: {
        color: '#080808',
    },
    cancelText: {
        fontSize: 14,
        color: '#9a9a9a',
        fontWeight: '500',
    },
});
