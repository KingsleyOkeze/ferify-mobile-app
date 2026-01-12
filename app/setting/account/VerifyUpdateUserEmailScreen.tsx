import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Animated,
    Easing,
    ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const OTP_LENGTH = 4;

function VerifyUpdateUserEmail() {
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const spinValue = useRef(new Animated.Value(0)).current;

    // Spinner Animation
    useEffect(() => {
        if (isLoading) {
            Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            spinValue.setValue(0);
        }
    }, [isLoading]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    // Timer Logic for Resend
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleKeyPress = (val: string) => {
        if (isLoading) return;

        const currentOtp = [...otp];
        const emptyIndex = currentOtp.findIndex((item) => item === '');

        if (val === 'delete') {
            const lastFilledIndex = currentOtp.map((item, i) => item !== '' ? i : -1).reverse().find(i => i !== -1);
            if (lastFilledIndex !== undefined) {
                currentOtp[lastFilledIndex] = '';
                setOtp(currentOtp);
            }
            return;
        }

        if (emptyIndex !== -1) {
            currentOtp[emptyIndex] = val;
            setOtp(currentOtp);

            // Check if complete
            if (emptyIndex === OTP_LENGTH - 1) {
                finishOtp();
            }
        }
    };

    const finishOtp = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            router.back(); // Mock success
            router.back();
        }, 2000);
    };

    const handleResend = () => {
        if (timer === 0) {
            setTimer(15);
        }
    };

    const renderKeypadButton = (val: string, icon?: any) => (
        <TouchableOpacity
            style={styles.keypadBtn}
            onPress={() => handleKeyPress(val === 'backspace' ? 'delete' : val)}
        >
            {icon ? (
                <Ionicons name={icon} size={24} color="#000" />
            ) : (
                <Text style={styles.keypadText}>{val}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Enter the code</Text>
                <Text style={styles.subtitle}>
                    Enter the verification code sent to your email address.
                </Text>

                {/* OTP Boxes */}
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <View
                            key={index}
                            style={[
                                styles.otpBox,
                                digit !== '' && styles.otpBoxFilled,
                                // Highlight current empty box
                                otp.findIndex(d => d === '') === index && styles.otpBoxActive
                            ]}
                        >
                            <Text style={styles.otpDigit}>{digit}</Text>
                        </View>
                    ))}
                </View>

                {/* Resend Link */}
                <TouchableOpacity onPress={handleResend} style={styles.resendContainer}>
                    <Text style={styles.resendText}>
                        Resend code {timer > 0 ? `in ${timer}s` : ''}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Custom Keypad */}
            <View style={styles.keypad}>
                <View style={styles.keypadRow}>
                    {renderKeypadButton('1')}
                    {renderKeypadButton('2')}
                    {renderKeypadButton('3')}
                </View>
                <View style={styles.keypadRow}>
                    {renderKeypadButton('4')}
                    {renderKeypadButton('5')}
                    {renderKeypadButton('6')}
                </View>
                <View style={styles.keypadRow}>
                    {renderKeypadButton('7')}
                    {renderKeypadButton('8')}
                    {renderKeypadButton('9')}
                </View>
                <View style={styles.keypadRow}>
                    <View style={styles.keypadBtnEmpty} />
                    {renderKeypadButton('0')}
                    {renderKeypadButton('backspace', 'backspace-outline')}
                </View>
            </View>

            {/* Spinner Overlay */}
            {isLoading && (
                <View style={styles.overlay}>
                    <View style={styles.spinnerContainer}>
                        <Animated.View style={{ transform: [{ rotate: spin }] }}>
                            <Ionicons name="refresh" size={50} color="#fff" />
                        </Animated.View>
                        {/* Alternative standard spinner if refresh icon is not exactly "broken circle" enough */}
                        {/* <ActivityIndicator size="large" color="#fff" /> */}
                    </View>
                </View>
            )}
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
        paddingVertical: 15,
    },
    backButton: {
        padding: 4,
    },
    content: {
        paddingHorizontal: 25,
        paddingTop: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
        marginBottom: 40,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    otpBox: {
        width: 65,
        height: 65,
        borderRadius: 12,
        backgroundColor: '#F9F9F9',
        borderWidth: 2,
        borderColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpBoxActive: {
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    otpBoxFilled: {
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    otpDigit: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    resendContainer: {
        alignSelf: 'flex-start',
    },
    resendText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    keypad: {
        marginTop: 'auto',
        paddingBottom: 20,
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 10,
    },
    keypadBtn: {
        width: 80,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keypadBtnEmpty: {
        width: 80,
        height: 60,
    },
    keypadText: {
        fontSize: 24,
        fontWeight: '500',
        color: '#000',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    spinnerContainer: {
        padding: 30,
        borderRadius: 20,
    },
});

export default VerifyUpdateUserEmail;
