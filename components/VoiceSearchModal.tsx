import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
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
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
// @ts-ignore
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition";

// --- COMPONENTS ---

// 1. The Red Ripple (Listening Mode)
const RippleRing = ({ delay }: { delay: number }) => {
    const ring = useSharedValue(0);

    useEffect(() => {
        ring.value = withDelay(
            delay, // Delay set by prop + some base offset if needed
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
    const [mode, setMode] = useState<'listening' | 'processing' | 'error'>('listening');
    const [partialResults, setPartialResults] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useSpeechRecognitionEvent("start", () => {
        setMode('listening');
    });

    useSpeechRecognitionEvent("end", () => {
        // Transition to processing while we wait for final results (if not already handled)
        setMode(prev => prev === 'error' ? 'error' : 'processing');
    });

    useSpeechRecognitionEvent("result", (event) => {
        console.log('Voice results:', event.results);
        if (event.results && event.results.length > 0) {
            const bestMatch = event.results[0]?.transcript;
            if (bestMatch) {
                setPartialResults([bestMatch]);
                setMode('processing');

                if (event.isFinal) {
                    // Quick delay to show processing state, then navigate
                    setTimeout(() => {
                        onClose();
                        router.push({
                            pathname: "/route/RouteSelectScreen",
                            params: {
                                initialTo: bestMatch
                            }
                        });
                    }, 1000);
                }
            }
        }
    });

    useSpeechRecognitionEvent("error", (event) => {
        console.error('Voice error:', event.error, event.message);
        if (event.error !== 'aborted') {
            handleError("We couldn't hear you. Try again.");
        }
    });

    useEffect(() => {
        if (visible) {
            startListening();
        } else {
            stopListening();
        }
        return () => {
            stopListening();
        };
    }, [visible]);

    const startListening = async () => {
        setMode('listening');
        setErrorMessage('');
        setPartialResults([]);
        try {
            const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
            if (!result.granted) {
                handleError('Microphone permission not granted.');
                return;
            }

            ExpoSpeechRecognitionModule.start({
                lang: "en-US",
                interimResults: true,
                continuous: false,
            });
        } catch (e: any) {
            console.error('Voice start error', e);
            handleError('Could not start microphone. ' + (e.message || ''));
        }
    };

    const stopListening = async () => {
        try {
            ExpoSpeechRecognitionModule.stop();
        } catch (e) {
            console.error('Voice stop error', e);
        }
    };

    const handleError = (msg: string) => {
        setMode('error');
        setErrorMessage(msg);
    };

    const handleRetry = () => {
        startListening();
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

                        {/* ERROR MODE: Show Error Icon (Optional, or just static mic) */}
                        {mode === 'error' && (
                            <View style={[styles.micCircle, { backgroundColor: '#FFEBEA' }]}>
                                <Ionicons name="alert" size={32} color="#FF3B30" />
                            </View>
                        )}

                        {/* The Mic Icon (Always on top unless error) */}
                        {mode !== 'error' && (
                            <View style={styles.micCircle}>
                                <Ionicons name="mic" size={32} color="#000" />
                            </View>
                        )}
                    </View>

                    {/* Text Updates based on Mode */}
                    <View style={styles.textWrapper}>
                        {mode === 'listening' && (
                            <Text style={[styles.statusText, styles.textRed]}>Listening...</Text>
                        )}
                        {mode === 'processing' && (
                            <Text style={[styles.statusText, styles.textBlack]}>Processing...</Text>
                        )}
                        {mode === 'error' && (
                            <>
                                <Text style={[styles.statusText, styles.textRed, { textAlign: 'center' }]}>
                                    {errorMessage || "Something went wrong"}
                                </Text>
                                <TouchableOpacity onPress={handleRetry} style={{ marginTop: 8 }}>
                                    <Text style={{ color: '#007AFF', fontWeight: '600' }}>Try Again</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={{ marginTop: mode === 'error' ? 16 : 0 }}>
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        width: 260,
        minHeight: 240, // Changed to minHeight for dynamic content
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
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
});