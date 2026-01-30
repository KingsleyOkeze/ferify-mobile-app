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
    interpolate,
    useDerivedValue,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import { getCachedLocation } from '@/services/locationService';
import { isVoiceAvailable, getVoiceUnavailableMessage } from '@/utils/voiceUtils';

// --- CONFIGURATION ---
const DELAY_BEFORE_WAVE = 1000;

// --- COMPONENTS ---

// 1. The Red Ripple (Listening Mode)
const RippleRing = ({ delay }: { delay: number }) => {
    const ring = useSharedValue(0);

    useEffect(() => {
        ring.value = withDelay(
            DELAY_BEFORE_WAVE + delay,
            withRepeat(
                withTiming(1, {
                    duration: 2000,
                    easing: Easing.out(Easing.ease),
                }),
                -1,
                false
            )
        );
        return () => cancelAnimation(ring);
    }, []);

    const style = useAnimatedStyle(() => {
        return {
            opacity: interpolate(ring.value, [0, 0.7, 1], [0.8, 0.4, 0]),
            transform: [{ scale: interpolate(ring.value, [0, 1], [1, 2.8]) }],
        };
    });

    return <Animated.View style={[styles.ripple, style]} />;
};

// 2. The Black Spinner (Processing Mode)
const ProcessingSpinner = () => {
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 1000,
                easing: Easing.linear,
            }),
            -1,
            false
        );
        return () => cancelAnimation(rotation);
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    return (
        <View style={styles.spinnerContainer}>
            {/* The light grey track */}
            <View style={styles.spinnerTrack} />
            {/* The rotating black segment */}
            <Animated.View style={[styles.spinnerSegment, animatedStyle]} />
        </View>
    );
};

// --- MAIN MODAL ---
interface VoiceSearchModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function VoiceSearchModal({ visible, onClose }: VoiceSearchModalProps) {
    const router = useRouter();
    const [mode, setMode] = useState<'listening' | 'processing' | 'unavailable'>('listening');
    const [spokenText, setSpokenText] = useState<string>('');
    const [voiceReady, setVoiceReady] = useState<boolean>(false);

    useEffect(() => {
        // Check voice availability on mount
        const checkVoice = async () => {
            const available = await isVoiceAvailable();
            setVoiceReady(available);

            if (!available) {
                setMode('unavailable');
            }
        };
        checkVoice();

        // Setup Voice listeners only if available
        if (Voice) {
            Voice.onSpeechStart = () => setMode('listening');
            Voice.onSpeechResults = (e: SpeechResultsEvent) => {
                if (e.value && e.value.length > 0) {
                    setSpokenText(e.value[0]);
                    setMode('processing');
                    handleCompletion(e.value[0]);
                }
            };
            Voice.onSpeechError = (e: SpeechErrorEvent) => {
                console.error('Speech recognition error:', e.error);
                onClose();
            };
        }

        return () => {
            const cleanup = async () => {
                try {
                    if (Voice) {
                        await Voice.stop();
                        await Voice.destroy();
                        Voice.removeAllListeners();
                    }
                } catch (e) {
                    console.error(e);
                }
            };
            cleanup();
        };
    }, []);

    const handleCompletion = async (text: string) => {
        try {
            const cachedLocation = await getCachedLocation();
            const fromAddress = cachedLocation?.address || '';

            onClose();
            // Navigate to RouteSelectScreen with params
            router.push({
                pathname: "/route/RouteSelectScreen",
                params: {
                    initialTo: text,
                    initialFrom: fromAddress
                }
            });
        } catch (error) {
            console.error('Error in handleCompletion:', error);
            onClose();
        }
    };

    useEffect(() => {
        if (visible && voiceReady) {
            setMode('listening');
            setSpokenText('');
            startListening();
        } else if (visible && !voiceReady) {
            setMode('unavailable');
        } else {
            stopListening();
        }
    }, [visible, voiceReady]);

    const startListening = async () => {
        if (!voiceReady) {
            console.warn("Voice module is not available.");
            return;
        }

        try {
            if (Voice && typeof Voice.start === 'function') {
                await Voice.start('en-US');
            }
        } catch (e) {
            console.error('Voice start error:', e);
            setMode('unavailable');
        }
    };

    const stopListening = async () => {
        try {
            // Add the check here to stop the "property of null" error
            if (Voice && typeof Voice.stop === 'function') {
                await Voice.stop();
            }
        } catch (e) {
            console.error('Voice stop error:', e);
        }
    };


    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalCard}>

                    {/* Visual Stage */}
                    <View style={styles.micStage}>

                        {/* LISTENING MODE: Show Red Ripples */}
                        {mode === 'listening' && (
                            <>
                                <RippleRing delay={0} />
                                <RippleRing delay={600} />
                                <RippleRing delay={1200} />
                            </>
                        )}

                        {/* PROCESSING MODE: Show Spinner Track */}
                        {mode === 'processing' && <ProcessingSpinner />}

                        {/* The Mic Icon (Always on top) */}
                        <View style={styles.micCircle}>
                            <Ionicons name="mic" size={32} color="#000" />
                        </View>
                    </View>

                    {/* Text Updates based on Mode */}
                    <View style={styles.textWrapper}>
                        <Text style={[
                            styles.statusText,
                            mode === 'processing' ? styles.textBlack :
                                mode === 'unavailable' ? styles.textGray : styles.textRed
                        ]}>
                            {mode === 'listening' ? 'Listening...' :
                                mode === 'processing' ? 'Processing...' :
                                    'Voice Search Unavailable'}
                        </Text>

                        {mode === 'unavailable' ? (
                            <Text style={styles.unavailableMessage}>
                                {getVoiceUnavailableMessage()}
                            </Text>
                        ) : (
                            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                                <Text style={styles.cancelText}>Tap to cancel</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                </View>
            </View>
        </Modal >
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        width: 260,
        height: 240,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    micStage: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    micCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20, // Must be higher than ripples and spinner
    },
    // --- RED RIPPLE STYLES ---
    ripple: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 59, 48, 0.2)',
        zIndex: 1,
    },
    // --- PROCESSING SPINNER STYLES ---
    spinnerContainer: {
        position: 'absolute',
        width: 86, // Slightly larger than mic circle (70 + borders)
        height: 86,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    spinnerTrack: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 43,
        borderWidth: 4,
        borderColor: '#F0F0F0', // Very light grey track
    },
    spinnerSegment: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 43,
        borderWidth: 4,
        borderTopColor: '#000000', // The "Black stuff"
        borderRightColor: '#000000',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        zIndex: 15, // Ensure it's above the track
    },
    // --- TEXT STYLES ---
    textWrapper: {
        alignItems: 'center',
        gap: 8,
    },
    statusText: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    textRed: {
        color: '#FF3B30',
    },
    textBlack: {
        color: '#000000',
    },
    cancelText: {
        fontSize: 14,
        color: '#8E8E93',
        fontWeight: '500',
    },
    textGray: {
        color: '#666666',
    },
    unavailableMessage: {
        fontSize: 13,
        color: '#8E8E93',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 18,
    },
});