import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
    Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '@/services/api';

// Logo
import LOGO from "@/assets/images/logo/BLACK-LOGO.png";

export default function VerifySignupEmailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const email = params.email as string || "your email";

    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value.length === 1 && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-verify if last digit is entered
        if (value.length === 1 && index === 3) {
            handleVerify(newOtp.join(''));
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (otpCode: string) => {
        setIsLoading(true);
        try {
            // 1. Verify OTP
            const verifyResponse = await api.post("/api/user/auth/register/verify-otp", {
                email: email,
                code: otpCode
            });

            console.log("OTP verified:", verifyResponse.data);

            Alert.alert('Success', 'Email verified successfully!', [
                { text: 'Continue', onPress: () => router.replace('/tabs/HomeScreen') }
            ]);
        } catch (error: any) {
            console.error('Verify OTP error:', error.response?.data || error.message);
            Alert.alert('Error', error.response?.data?.error || 'Verification failed. Please check the code.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        setIsLoading(true);
        try {
            await api.get(`/api/user/auth/register/resend-otp/${email}`);
            setTimer(30);
            setOtp(['', '', '', '']);
            inputRefs.current[0]?.focus();
            Alert.alert("Success", "A new code has been sent to your email.");
        } catch (error: any) {
            console.error('Resend OTP error:', error.response?.data || error.message);
            Alert.alert('Error', error.response?.data?.error || 'Failed to resend code');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* Back Arrow */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#080808" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Title and Subtitle */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Email verification</Text>
                        <Text style={styles.subtitle}>
                            Enter the 4-digit code sent to{"\n"}
                            <Text style={styles.emailText}>{email}</Text>
                        </Text>
                    </View>

                    {/* Logo */}
                    <Image
                        source={LOGO}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    {/* OTP Inputs (4 Boxes) */}
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                style={[
                                    styles.otpInput,
                                    digit !== '' && styles.otpInputFilled
                                ]}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                selectTextOnFocus
                                autoFocus={index === 0}
                                editable={!isLoading}
                            />
                        ))}
                    </View>

                    {/* Resend Code (Bottom Left) */}
                    <View style={styles.footerAction}>
                        {timer > 0 ? (
                            <Text style={styles.timerText}>Resend code in <Text style={styles.timerCount}>{timer}s</Text></Text>
                        ) : (
                            <TouchableOpacity onPress={handleResend} disabled={isLoading}>
                                <Text style={styles.resendText}>Resend code</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>

                {/* Loading Overlay */}
                {isLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#080808" />
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '500',
        color: '#080808',
    },
    textContainer: {
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#080808',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    emailText: {
        fontWeight: '600',
        color: '#080808',
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 32,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 32,
    },
    otpInput: {
        width: 64,
        height: 64,
        backgroundColor: "#F5F7F9",
        borderRadius: 12,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#080808',
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    otpInputFilled: {
        borderColor: '#080808',
        backgroundColor: '#fff',
    },
    footerAction: {
        alignItems: 'flex-start',
    },
    resendText: {
        fontSize: 16,
        color: '#080808',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    timerText: {
        fontSize: 14,
        color: '#666',
    },
    timerCount: {
        fontWeight: 'bold',
        color: '#080808',
    },
});
