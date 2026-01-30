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
    Alert
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';
import { useLoader } from '@/contexts/LoaderContext';

function VerifyUpdateUserEmailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const email = params.email as string || "your email";
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const { showLoader, hideLoader } = useLoader();
    const inputRefs = useRef<Array<TextInput | null>>([]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
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
        if (value.length === 1 && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            Alert.alert('Error', 'Please enter a 6-digit code');
            return;
        }

        showLoader();
        try {
            const response = await api.post('/api/user/account/update-email/verify', { otp: otpString });
            if (response.status === 200) {
                // Update local storage
                if (email) {
                    await AsyncStorage.setItem('userEmail', email as string);
                }

                // Redirect back to home or profile
                Alert.alert('Success', 'Email updated successfully', [
                    { text: 'OK', onPress: () => router.dismiss(2) }
                ]);
            }
        } catch (error: any) {
            console.error('Verify OTP error:', error);
            Alert.alert('Error', error.response?.data?.error || 'Verification failed');
        } finally {
            hideLoader();
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        showLoader();
        try {
            await api.post('/api/user/account/update-user-email', { newEmail: email });
            setTimer(30);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (error: any) {
            console.error('Resend OTP error:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to resend code');
        } finally {
            hideLoader();
        }
    };

    const isOtpComplete = otp.join('').length === 6;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Verify Email</Text>
                <View style={styles.headerButton} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <Text style={styles.screenTitle}>Enter verification code</Text>
                    <Text style={styles.descriptionText}>
                        A 6-digit code has been sent to <Text style={styles.emailText}>{email}</Text>
                    </Text>

                    {/* OTP Inputs */}
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => {
                                    inputRefs.current[index] = ref;
                                }}
                                style={[styles.otpInput, digit !== '' && styles.otpInputFilled]}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                selectTextOnFocus
                                autoFocus={index === 0}
                            />
                        ))}
                    </View>

                    {/* Resend Section */}
                    <View style={styles.resendContainer}>
                        {timer > 0 ? (
                            <Text style={styles.timerText}>Resend code in {timer}s</Text>
                        ) : (
                            <TouchableOpacity onPress={handleResend}>
                                <Text style={styles.resendText}>Resend code</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>

                {/* Footer Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.verifyButton,
                            !isOtpComplete && styles.verifyButtonDisabled
                        ]}
                        disabled={!isOtpComplete}
                        onPress={handleVerify}
                    >
                        <Text style={[
                            styles.verifyButtonText,
                            !isOtpComplete && styles.verifyButtonTextDisabled
                        ]}>
                            Verify
                        </Text>
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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerButton: {
        width: 32,
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        flex: 1,
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 40,
        alignItems: 'center',
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
        textAlign: 'center',
    },
    descriptionText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 40,
        textAlign: 'center',
    },
    emailText: {
        fontWeight: 'bold',
        color: '#000',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 30,
    },
    otpInput: {
        width: 45,
        height: 55,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: 8,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: '#F9F9F9',
        color: '#000',
    },
    otpInputFilled: {
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    resendContainer: {
        marginTop: 10,
    },
    timerText: {
        fontSize: 14,
        color: '#999',
    },
    resendText: {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
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
    verifyButtonTextDisabled: {
        color: '#979797',
    },
});

export default VerifyUpdateUserEmailScreen;
