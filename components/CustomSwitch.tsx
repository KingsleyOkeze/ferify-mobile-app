import React, { useEffect, useRef } from 'react';
import {
    View,
    Pressable,
    StyleSheet,
    Animated,
    ViewStyle,
} from 'react-native';

interface CustomSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    trackColor?: { false: string; true: string };
    thumbColor?: string;
    style?: ViewStyle;
}

export default function CustomSwitch({
    value,
    onValueChange,
    trackColor = { false: '#E3E3E3', true: '#080808' },
    thumbColor = '#FFFFFF',
    style,
}: CustomSwitchProps) {
    // Dimensions
    const TRACK_WIDTH = 37.14;
    const TRACK_HEIGHT = 20;
    const THUMB_SIZE = 14.29;
    const PADDING = (TRACK_HEIGHT - THUMB_SIZE) / 2; // ~2.855
    const TRANSLATE_X = TRACK_WIDTH - THUMB_SIZE - (PADDING * 2);

    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: value ? 1 : 0,
            duration: 200,
            useNativeDriver: false, // Background color cannot use native driver
        }).start();
    }, [value]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, TRANSLATE_X],
    });

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [trackColor.false, trackColor.true],
    });

    return (
        <Pressable onPress={() => onValueChange(!value)} style={style}>
            <Animated.View
                style={[
                    styles.track,
                    {
                        width: TRACK_WIDTH,
                        height: TRACK_HEIGHT,
                        borderRadius: TRACK_HEIGHT / 2,
                        backgroundColor: backgroundColor,
                        padding: PADDING,
                    },
                ]}
            >
                <Animated.View
                    style={[
                        styles.thumb,
                        {
                            width: THUMB_SIZE,
                            height: THUMB_SIZE,
                            borderRadius: THUMB_SIZE / 2,
                            backgroundColor: thumbColor,
                            transform: [{ translateX }],
                        },
                    ]}
                />
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    track: {
        justifyContent: 'center',
        alignItems: 'flex-start', // Start from left
    },
    thumb: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
});

