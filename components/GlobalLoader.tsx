import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, Image } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    cancelAnimation,
} from 'react-native-reanimated';

// --- CONFIGURATION ---
const SPINNER_SIZE = 40;
const STROKE_WIDTH = 5;
const LOGO_SIZE = 15.24;
const LOGO_HEIGHT = 18;

const YOUR_LOGO_SOURCE = require('../assets/images/logo/LOADER-LOGO.png');

interface GlobalLoaderProps {
    visible: boolean;
}

export default function GlobalLoader({ visible }: GlobalLoaderProps) {
    const rotation = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            rotation.value = 0;
            rotation.value = withRepeat(
                withTiming(360, {
                    duration: 1000,
                    easing: Easing.linear,
                }),
                -1 // Infinite repeat
            );
        } else {
            cancelAnimation(rotation);
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* The Light Grey Track (Static Background) */}
                    <View style={styles.track} />

                    {/* The Black Rotating Segment (Explicit zIndex to ensure visibility) */}
                    <Animated.View style={[styles.spinner, animatedStyle]} />

                    {/* The Logo (Static Center) */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={YOUR_LOGO_SOURCE}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#0A0A0A66',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: SPINNER_SIZE,
        height: SPINNER_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    track: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: SPINNER_SIZE / 2,
        borderWidth: STROKE_WIDTH,
        borderColor: '#CECECE', // Light Grey Track
    },
    spinner: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: SPINNER_SIZE / 2,
        borderWidth: STROKE_WIDTH,
        // We use transparent for the parts we don't want to show
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: '#000000',
        borderTopColor: '#000000',
        zIndex: 2, // Explicitly above the track
    },
    logoContainer: {
        position: 'absolute',
        width: LOGO_SIZE,
        height: LOGO_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
});