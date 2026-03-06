import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '@/services/api'; // Removed setToken/setRefreshToken as not needed for reset
import CustomNumberKeyboard from '@/components/CustomNumberKeyboard';
import { useLoader } from '@/contexts/LoaderContext';
import { useToast } from '@/contexts/ToastContext';


export default function VerifyPasswordResetScreen() {
    const router = useRouter();
    // Retrieve newPassword from params as required for reset flow
    const { newPassword } = useLocalSearchParams<{ newPassword: string }>();
    const { showToast } = useToast();

    const [otp, setOtp] = useState(['', '', '', '']); // 4 digits

    // Password reset usually starts with timer running
    const [timer, setTimer] = useState(60);

    const { showLoader, hideLoader } = useLoader();
    const hasAttemptedSend = useRef(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // Removed the "auto-send" logic from Signup as it's not standard for this reset flow (user usually initiates from previous screen)

    const handleOtpPress = (digit: string) => {
        if (activeIndex > 3) return;

        const newOtp = [...otp];
        newOtp[activeIndex] = digit;
        setOtp(newOtp);

        if (activeIndex < 3) {
            setActiveIndex(activeIndex + 1);
        } else {
            // Auto-verify if last digit is entered
            handleVerify(newOtp.join(''));
        }
    };

    const handleOtpDelete = () => {

        const newOtp = [...otp];
        if (newOtp[activeIndex] !== '') {
            newOtp[activeIndex] = '';
        } else if (activeIndex > 0) {
            newOtp[activeIndex - 1] = '';
            setActiveIndex(activeIndex - 1);
        }
        setOtp(newOtp);
    };


    const handleVerify = async (otpCode: string) => {
        // Validation for 4 digits
        if (otpCode.length < 4) return;

        showLoader();
        try {
            // 1. Verify Password Reset OTP
            const response = await api.post("/api/user/account/reset-password/verify", {
                otp: otpCode,
                newPassword: newPassword
            });

            console.log("Password Reset verified:", response.data);

            if (response.status === 200) {
                showToast('success', 'Password updated successfully!');
                // Go back to security screen or login
                router.dismiss(2);
            }

        } catch (error: any) {
            console.error('Verify OTP error:', error.response?.data || error.message);
            showToast('error', error.response?.data?.error || 'Verification failed. Please check the code.');
        } finally {
            hideLoader();
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        showLoader();
        try {
            // Resend endpoint for password reset
            await api.post('/api/user/account/reset-password/initiate');
            setTimer(60);
            setOtp(['', '', '', '']);
            setActiveIndex(0);
            showToast('success', 'A new code has been sent to your email.');
        } catch (error: any) {
            console.error('OTP resend error:', error);
            showToast('error', error.response?.data?.error || 'Failed to resend code');
        } finally {
            hideLoader();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1 }}>
                {/* Back Arrow */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#080808" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Title and Subtitle */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Enter code</Text>
                        <Text style={styles.subtitle}>
                            We've sent a 4-digit verification code to your email. Enter it below to confirm your password change.
                        </Text>
                    </View>
                    {/* OTP Inputs (4 Boxes) */}
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={1}
                                style={[
                                    styles.otpInput,
                                    digit !== '' && styles.otpInputFilled,
                                    activeIndex === index && styles.otpInputActive
                                ]}
                                onPress={() => setActiveIndex(index)}
                            >
                                <Text style={styles.otpInputText}>{digit}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Resend Code (Bottom Left) */}
                    <View style={styles.footerAction}>
                        {timer > 0 ? (
                            <Text style={styles.timerText}>Resend code in <Text style={styles.timerCount}>{timer}s</Text></Text>
                        ) : (
                            <TouchableOpacity onPress={handleResend}>
                                <Text style={styles.resendText}>Resend code</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>

                {/* Custom Keyboard */}
                <CustomNumberKeyboard
                    onPress={handleOtpPress}
                    onDelete={handleOtpDelete}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFB',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 40,
    },
    textContainer: {
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#080808',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '400',
        color: '#393939',
        lineHeight: 24,
    },
    emailText: {
        fontWeight: '400',
        fontSize: 14,
        color: '#393939',
        paddingLeft: 10
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 32,
    },
    otpInput: {
        width: 74,
        height: 61,
        backgroundColor: "#F0F0F0",
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    otpInputFilled: {
        borderColor: '#080808',
        backgroundColor: '#F2F3F4',
    },
    footerAction: {
        alignItems: 'flex-start',
    },
    resendText: {
        fontSize: 16,
        color: '#080808',
        fontWeight: 700,
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
    otpInputActive: {
        borderColor: '#080808',
        borderWidth: 2,
    },
    otpInputText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#080808',
    },
});
