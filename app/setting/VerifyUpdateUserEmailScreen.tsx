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
    Dimensions
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';
import { useLoader } from '@/contexts/LoaderContext';
import CustomNumberKeyboard from '@/components/CustomNumberKeyboard';

const { width } = Dimensions.get('window');

function VerifyUpdateUserEmailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const email = params.email as string || "your email";
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const { showLoader, hideLoader } = useLoader();
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const [focusedIndex, setFocusedIndex] = useState(0);

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
        const currentOtp = [...otp];
        if (currentOtp[focusedIndex] === '') {
            currentOtp[focusedIndex] = val;
            const updatedOtp = [...currentOtp];
            setOtp(updatedOtp);
            if (focusedIndex < 5) {
                setFocusedIndex(focusedIndex + 1);
                inputRefs.current[focusedIndex + 1]?.focus();
            } else {
                // All 6 digits entered, auto-verify if needed or just wait for manual Verify
                // For this screen, we have a manual Verify button, so we just set the last digit
            }
        } else if (focusedIndex < 5) {
            currentOtp[focusedIndex + 1] = val;
            const updatedOtp = [...currentOtp];
            setOtp(updatedOtp);
            setFocusedIndex(focusedIndex + 1);
            inputRefs.current[focusedIndex + 1]?.focus();
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
                                style={[
                                    styles.otpInput,
                                    digit !== '' && styles.otpInputFilled,
                                    focusedIndex === index && styles.otpInputFocused
                                ]}
                                value={digit}
                                showSoftInputOnFocus={false}
                                onFocus={() => setFocusedIndex(index)}
                                maxLength={1}
                                caretHidden
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

                {/* Custom Keypad at the bottom */}
                <CustomNumberKeyboard onPress={handleKeyPress} onDelete={handleDelete} />
            </KeyboardAvoidingView>
        </SafeAreaView >
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
        width: (width - 60) / 6,
        height: 55,
        borderWidth: 1.5,
        borderColor: '#F0F0F0',
        borderRadius: 8,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: '#F0F0F0',
        color: '#000',
    },
    otpInputFilled: {
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    otpInputFocused: {
        borderColor: '#6B6B6B',
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
});

export default VerifyUpdateUserEmailScreen;
