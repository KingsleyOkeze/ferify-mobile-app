import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, Image, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    cancelAnimation,
} from 'react-native-reanimated';

// --- CONFIGURATION ---
const SPINNER_SIZE = 80; // Total diameter
const STROKE_WIDTH = 5;  // Thickness of the ring
const LOGO_SIZE = 40;    // Size of the logo inside

// Replace this with your actual local image import
// e.g., require('../assets/images/logo.png')
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
            statusBarTranslucent // Covers the status bar too
        >
            <View style={styles.overlay}>
                {/* The Spinner Container */}
                <View style={styles.spinnerContainer}>

                    {/* The Light Grey Track (Static) */}
                    <View style={styles.track} />

                    {/* The Black Rotating Segment */}
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
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Whitish semi-transparent overlay like screenshot
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinnerContainer: {
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
        borderColor: '#E5E5E5', // Light Grey Track
    },
    spinner: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: SPINNER_SIZE / 2,
        borderWidth: STROKE_WIDTH,
        borderTopColor: '#000000',
        borderRightColor: '#000000',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        zIndex: 2, // Ensure it's above the track
    },
    logoContainer: {
        position: 'absolute',
        width: LOGO_SIZE,
        height: LOGO_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
});