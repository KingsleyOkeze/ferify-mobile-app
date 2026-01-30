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
    Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '@/services/api';
import { useLoader } from '@/contexts/LoaderContext';

function VerifyPasswordResetScreen() {
    const router = useRouter();
    const { newPassword } = useLocalSearchParams<{ newPassword: string }>();

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const { showLoader, hideLoader } = useLoader();

    const inputRefs = useRef<Array<TextInput | null>>([]);

    // Timer logic
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');
        if (otpCode.length < 6) return;

        showLoader();
        try {
            const response = await api.post('/api/user/account/reset-password/verify', {
                otp: otpCode,
                newPassword: newPassword
            });

            if (response.status === 200) {
                Alert.alert('Success', 'Password updated successfully!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Go back to security screen
                            router.dismiss(2);
                        }
                    }
                ]);
            }
        } catch (error: any) {
            console.error('OTP verification error:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to verify code');
        } finally {
            hideLoader();
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        showLoader();
        try {
            await api.post('/api/user/account/reset-password/initiate');
            setTimer(60);
            Alert.alert('Success', 'A new verification code has been sent to your email.');
        } catch (error: any) {
            console.error('OTP resend error:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to resend code');
        } finally {
            hideLoader();
        }
    };

    const isOtpComplete = otp.every(digit => digit !== '');

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Verification</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.textSection}>
                    <Text style={styles.screenTitle}>Enter code</Text>
                    <Text style={styles.instructionText}>
                        We've sent a 6-digit verification code to your email. Enter it below to confirm your password change.
                    </Text>
                </View>

                {/* OTP Input Group */}
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => {
                                inputRefs.current[index] = ref;
                            }}
                            style={styles.otpInput}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={digit}
                            onChangeText={(value) => handleOtpChange(value, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                        />
                    ))}
                </View>

                {/* Resend Timer */}
                <View style={styles.resendSection}>
                    <Text style={styles.timerText}>
                        Resend code in <Text style={styles.timerBold}>{timer}s</Text>
                    </Text>
                    <TouchableOpacity
                        onPress={handleResend}
                        disabled={timer > 0}
                    >
                        <Text style={[
                            styles.resendLink,
                            (timer > 0) && styles.resendLinkDisabled
                        ]}>
                            Resend Code
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.verifyButton,
                            !isOtpComplete && styles.verifyButtonDisabled
                        ]}
                        disabled={!isOtpComplete}
                        onPress={handleVerify}
                    >
                        <Text style={styles.verifyButtonText}>Verify & Update</Text>
                    </TouchableOpacity>
                </View>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        padding: 4,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 600,
        fontFamily: 'BrittiRegular',
        color: '#000',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    textSection: {
        marginBottom: 40,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#000',
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
        marginBottom: 30,
    },
    otpInput: {
        width: 45,
        height: 55,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: 8,
        backgroundColor: '#F9F9F9',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    resendSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    timerText: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        color: '#666',
        marginBottom: 8,
    },
    timerBold: {
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#000',
    },
    resendLink: {
        fontSize: 16,
        fontWeight: 600,
        color: '#000',
        textDecorationLine: 'underline',
    },
    resendLinkDisabled: {
        color: '#CCC',
    },
    footer: {
        marginTop: 'auto',
        marginBottom: 20,
    },
    verifyButton: {
        height: 50,
        backgroundColor: '#000',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifyButtonDisabled: {
        backgroundColor: '#F0F0F0',
    },
    verifyButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default VerifyPasswordResetScreen;
