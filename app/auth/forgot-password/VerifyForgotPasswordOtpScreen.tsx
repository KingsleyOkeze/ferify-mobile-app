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
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '@/services/api';
import { useToast } from '@/contexts/ToastContext';
import { useLoader } from '@/contexts/LoaderContext';
import CustomNumberKeyboard from '@/components/CustomNumberKeyboard';

const { width } = Dimensions.get('window');

function VerifyForgotPasswordOtpScreen() {
    const router = useRouter();
    const { showToast } = useToast();
    const { showLoader, hideLoader } = useLoader();
    const { email } = useLocalSearchParams<{ email: string }>();

    const [otp, setOtp] = useState(['', '', '', '']); // 4-digit OTP
    const [timer, setTimer] = useState(60);
    const [isResending, setIsResending] = useState(false);

    const inputRefs = useRef<Array<TextInput | null>>([]);
    const [focusedIndex, setFocusedIndex] = useState(0);

    // Timer logic
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleKeyPress = (val: string) => {
        const currentOtp = [...otp];
        if (currentOtp[focusedIndex] === '') {
            currentOtp[focusedIndex] = val;
            const updatedOtp = [...currentOtp];
            setOtp(updatedOtp);
            if (focusedIndex < 3) {
                setFocusedIndex(focusedIndex + 1);
                inputRefs.current[focusedIndex + 1]?.focus();
            } else {
                // All 4 digits entered, auto-verify
                handleVerify(updatedOtp.join(''));
            }
        } else if (focusedIndex < 3) {
            currentOtp[focusedIndex + 1] = val;
            const updatedOtp = [...currentOtp];
            setOtp(updatedOtp);
            setFocusedIndex(focusedIndex + 1);
            inputRefs.current[focusedIndex + 1]?.focus();
            if (focusedIndex + 1 === 3) {
                // All 4 digits entered, auto-verify
                handleVerify(updatedOtp.join(''));
            }
        }
    };

    const handleVerify = async (otpCode: string) => {
        if (otpCode.length < 4) return;

        showLoader();
        try {
            const response = await api.post('/api/user/auth/verify-forgot-password-otp', {
                email,
                otp: otpCode
            });

            if (response.status === 200) {
                const { token } = response.data;
                router.push({
                    pathname: '/auth/forgot-password/CompleteForgotPasswordScreen',
                    params: { token, email }
                });
            }
        } catch (error: any) {
            console.error('OTP verification error:', error);
            showToast('error', error.response?.data?.error || 'Failed to verify code');
        } finally {
            hideLoader();
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        setIsResending(true);
        try {
            await api.post('/api/user/auth/forgot-password', { email });
            setTimer(60);
            showToast('success', 'A new verification code has been sent to your email.');
        } catch (error: any) {
            console.error('OTP resend error:', error);
            showToast('error', error.response?.data?.error || 'Failed to resend code');
        } finally {
            setIsResending(false);
        }
    };

    const handleDelete = () => {
        const currentOtp = [...otp];
        if (currentOtp[focusedIndex] !== '') {
            currentOtp[focusedIndex] = '';
            setOtp(currentOtp);
        } else if (focusedIndex > 0) {
            currentOtp[focusedIndex - 1] = '';
            setOtp(currentOtp);
            setFocusedIndex(focusedIndex - 1);
            inputRefs.current[focusedIndex - 1]?.focus();
        }
    };

    const isOtpComplete = otp.every(digit => digit !== '');

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                {/* <Text style={styles.headerTitle}>Verification</Text> */}
            </View>

            <View style={styles.content}>
                <View style={styles.textSection}>
                    <Text style={styles.screenTitle}>Enter the verification code</Text>
                    <Text style={styles.instructionText}>
                        We've sent a 4-digit verification code to {email}. Enter it below to proceed.
                    </Text>
                </View>

                {/* OTP Input Group */}
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => { inputRefs.current[index] = ref; }}
                            style={[
                                styles.otpInput,
                                digit !== '' && styles.otpInputFilled,
                                focusedIndex === index && styles.otpInputFocused
                            ]}
                            showSoftInputOnFocus={false}
                            maxLength={1}
                            value={digit}
                            onFocus={() => setFocusedIndex(index)}
                            caretHidden
                        />
                    ))}
                </View>

                {/* Resend Section - Now left aligned and below OTP */}
                <View style={styles.resendSection}>
                    {timer > 0 ? (
                        <Text style={styles.timerText}>
                            Resend code in <Text style={styles.timerBold}>{timer}s</Text>
                        </Text>
                    ) : (
                        <TouchableOpacity
                            onPress={handleResend}
                            disabled={isResending}
                        >
                            <Text style={styles.resendLink}>
                                Resend code
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Custom Keypad at the bottom */}
            <CustomNumberKeyboard onPress={handleKeyPress} onDelete={handleDelete} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    headerButton: {
        padding: 4,
        marginRight: 10,
        marginLeft: -5
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'BrittiRegular',
        color: '#080808',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    textSection: {
        marginBottom: 30,
    },
    screenTitle: {
        fontSize: 24,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginBottom: 10,
    },
    instructionText: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        color: '#666',
        lineHeight: 20,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        width: '100%',
    },
    otpInput: {
        width: (width - 80) / 4,
        height: 61,
        borderWidth: 1.5,
        borderColor: '#F0F0F0',
        borderRadius: 10,
        backgroundColor: '#F0F0F0',
        textAlign: 'center',
        fontSize: 24,
        fontFamily: 'BrittiBold',
        color: '#080808',
    },
    otpInputFilled: {
        borderColor: '#080808',
        backgroundColor: '#fff',
    },
    otpInputFocused: {
        borderColor: '#6B6B6B',
    },
    resendSection: {
        marginTop: 10,
        marginBottom: 30,
    },
    timerText: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        color: '#666',
    },
    timerBold: {
        fontWeight: '700',
        color: '#080808',
    },
    resendLink: {
        fontSize: 14,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        textDecorationLine: 'underline',
    },
    resendLinkDisabled: {
        color: '#CCC',
    },
});

export default VerifyForgotPasswordOtpScreen;
