import React, { useState } from 'react';
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
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import api from '@/services/api';
import { useToast } from '@/contexts/ToastContext';
import { useLoader } from '@/contexts/LoaderContext';

function ForgotPasswordScreen() {
    const router = useRouter();
    const { showToast } = useToast();
    const { showLoader, hideLoader } = useLoader();
    const [email, setEmail] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleSendCode = async () => {
        if (!email || !email.includes('@')) {
            showToast('error', 'Please enter a valid email address');
            return;
        }

        showLoader();
        try {
            // Using the auth endpoint for non-logged in users
            const response = await api.post('/api/user/auth/forgot-password', { email });
            if (response.status === 200) {
                // Navigate to a dedicated verification screen for auth flow
                // Or reuse the existing one if adapted, but cleaner to have separate ones for auth vs settings
                router.push({
                    pathname: '/auth/forgot-password/VerifyForgotPasswordOtpScreen',
                    params: { email }
                });
            }
        } catch (error: any) {
            console.error('Forgot password initiation error:', error);
            showToast('error', error.response?.data?.error || 'Failed to send verification code');
        } finally {
            hideLoader();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="#080808" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.textSection}>
                    <Text style={styles.screenTitle}>Reset your password</Text>
                    <Text style={styles.instructionText}>
                        Enter your email address and we'll send you a code to reset your password.
                    </Text>
                </View>

                {/* Email Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email address</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={[
                                styles.input,
                                isInputFocused && styles.inputFocused
                            ]}
                            placeholder="e.g sample@gmail.com"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                        />
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            (!email) && styles.sendButtonDisabled
                        ]}
                        disabled={!email}
                        onPress={handleSendCode}
                    >
                        <Text style={styles.sendButtonText}>Send Code</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFB',
    },
    header: {
        // paddingHorizontal: 16,
        paddingTop: 10,
        // paddingBottom: 20,
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    textSection: {
        marginBottom: 32,
    },
    screenTitle: {
        fontSize: 24,
        fontFamily: 'BrittiBold',
        color: '#080808',
        marginBottom: 8,
        lineHeight: 24
    },
    instructionText: {
        fontSize: 16,
        color: '#393939',
        lineHeight: 24,
        fontFamily: 'BrittiRegular'
    },
    inputGroup: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
        color: '#080808',
        marginBottom: 8,
        fontFamily: 'BrittiRegular',
        marginLeft: 4,
    },
    inputWrapper: {
        backgroundColor: "#F5F7F9",
        borderRadius: 12,
        // paddingHorizontal: 16,
        height: 56,
        justifyContent: "center",
    },
    input: {
        height: 50,
        borderWidth: 1.5,
        borderColor: '#F0F0F0',
        borderRadius: 100,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#080808',
        backgroundColor: '#EDEDED',
        fontFamily: 'BrittiRegular'
    },
    inputFocused: {
        borderColor: '#6B6B6B',
        backgroundColor: '#F0F0F0',
    },
    footer: {
        marginTop: 'auto',
        paddingBottom: 20,
    },
    sendButton: {
        height: 56,
        backgroundColor: '#080808',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#F0F0F0',
    },
    sendButtonText: {
        fontSize: 16,
        fontFamily: 'BrittiBold',
        color: '#fff',
    },
});

export default ForgotPasswordScreen;
