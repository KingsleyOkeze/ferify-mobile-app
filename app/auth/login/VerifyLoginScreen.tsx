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
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import CustomNumberKeyboard from '@/components/CustomNumberKeyboard';
import { useLoader } from '@/contexts/LoaderContext';

export default function VerifyLoginScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const email = params.email as string || "your email";

    const [otp, setOtp] = useState(['', '', '', '']);
    const { showLoader, hideLoader } = useLoader();
    const [activeIndex, setActiveIndex] = useState(0);
    const [timer, setTimer] = useState(30);
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


    const { login } = useAuth();

    const handleVerify = async (otpCode: string) => {
        showLoader();
        try {
            // Verify Login OTP
            const response = await api.post("/api/user/auth/login/verify", {
                email: email,
                code: otpCode
            });

            console.log("Login verified:", response.data);

            const { accessToken, refreshToken, user: userData } = response.data;

            // Use AuthContext to handle storage and state
            if (userData && accessToken) {
                await login(userData, accessToken, refreshToken);
            }

            // On success, redirect to home
            router.replace('/(tabs)/HomeScreen');
        } catch (error: any) {
            console.error('Verify Login error:', error.response?.data || error.message);
            Alert.alert('Error', error.response?.data?.error || 'Verification failed. Please check the code.');
        } finally {
            hideLoader();
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        showLoader();
        try {
            await api.post("/api/user/auth/login/initiate", { email });
            setTimer(30);
            setOtp(['', '', '', '']);
            setActiveIndex(0);
            Alert.alert("Success", "A new code has been sent to your email.");
        } catch (error: any) {
            console.error('Resend Login OTP error:', error.response?.data || error.message);
            Alert.alert('Error', error.response?.data?.error || 'Failed to resend code');
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
                        <Text style={styles.title}>Enter the verification code</Text>
                        <Text style={styles.subtitle}>
                            We'll send a code of verification to <Text style={styles.emailText}>{email}</Text>
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
        paddingTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: -13,
        marginBottom: 24
    },
    scrollContent: {
        paddingHorizontal: 16,
        // paddingTop: 20,
        paddingBottom: 40,
    },
    textContainer: {
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#080808',
        marginBottom: 8,
        fontFamily: 'BrittiBold'
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '400',
        color: '#393939',
        lineHeight: 24,
        fontFamily: 'BrittiRegular'
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
        marginBottom: 12,
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
        fontFamily: 'BrittiBold',
        color: '#080808',
        fontWeight: 700,
        textDecorationLine: 'underline',
    },
    timerText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'BrittiRegular'
    },
    timerCount: {
        fontWeight: 'bold',
        color: '#080808',
        fontFamily: 'BrittiBold'
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
