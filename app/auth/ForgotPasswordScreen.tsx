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
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Forgot Password</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    headerButton: {
        padding: 4,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    textSection: {
        marginBottom: 30,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    instructionText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#F9F9F9',
    },
    footer: {
        marginTop: 'auto',
        marginBottom: 20,
    },
    sendButton: {
        height: 50,
        backgroundColor: '#000',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#F0F0F0',
    },
    sendButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default ForgotPasswordScreen;
