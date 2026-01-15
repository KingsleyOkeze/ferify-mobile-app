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
    Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import api from '@/services/api';

function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendCode = async () => {
        if (!email || !email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        try {
            // Using the auth endpoint for non-logged in users
            const response = await api.post('/api/user/auth/register/forgot-password', { email });
            if (response.status === 200) {
                // Navigate to a dedicated verification screen for auth flow
                // Or reuse the existing one if adapted, but cleaner to have separate ones for auth vs settings
                router.push({
                    pathname: '/auth/VerifyForgotPasswordOtpScreen',
                    params: { email }
                });
            }
        } catch (error: any) {
            console.error('Forgot password initiation error:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to send verification code');
        } finally {
            setIsLoading(false);
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
                            style={styles.input}
                            placeholder="e.g sample@gmail.com"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            (!email || isLoading) && styles.sendButtonDisabled
                        ]}
                        disabled={!email || isLoading}
                        onPress={handleSendCode}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.sendButtonText}>Send Code</Text>
                        )}
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
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    textSection: {
        marginBottom: 32,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#080808',
        marginBottom: 8,
    },
    instructionText: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
    },
    inputGroup: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#080808',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        backgroundColor: "#F5F7F9",
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        justifyContent: "center",
    },
    input: {
        fontSize: 16,
        color: '#080808',
    },
    footer: {
        marginTop: 20,
    },
    sendButton: {
        height: 56,
        backgroundColor: '#080808',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    sendButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default ForgotPasswordScreen;
