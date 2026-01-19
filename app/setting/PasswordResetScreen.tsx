import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import api from '@/services/api';

function PasswordResetScreen() {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Focus States
    const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

    // Validation
    const isFormValid = newPassword.length >= 8 && newPassword === confirmPassword;

    const handleUpdate = async () => {
        if (!isFormValid) return;

        setIsLoading(true);
        try {
            const response = await api.post('/api/user/account/reset-password/initiate');
            if (response.status === 200) {
                // Navigate to verification screen with the new password
                router.push({
                    pathname: '/setting/account/VerifyPasswordResetScreen',
                    params: { newPassword }
                });
            }
        } catch (error: any) {
            console.error('Password reset initiation error:', error);
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
                <Text style={styles.headerTitle}>Password</Text>
                <TouchableOpacity onPress={() => router.dismiss()} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.screenTitle}>Password reset</Text>
                    <Text style={styles.instructionText}>
                        Your new password must be at least 8 characters long and match the confirmation.
                    </Text>

                    {/* New Password Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>New password</Text>
                        <TextInput
                            style={[
                                styles.input,
                                isNewPasswordFocused && styles.inputFocused
                            ]}
                            placeholder="Enter new password"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                            onFocus={() => setIsNewPasswordFocused(true)}
                            onBlur={() => setIsNewPasswordFocused(false)}
                        />
                    </View>

                    {/* Confirm Password Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Confirm new password</Text>
                        <TextInput
                            style={[
                                styles.input,
                                isConfirmPasswordFocused && styles.inputFocused
                            ]}
                            placeholder="Confirm new password"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            onFocus={() => setIsConfirmPasswordFocused(true)}
                            onBlur={() => setIsConfirmPasswordFocused(false)}
                        />
                    </View>
                </ScrollView>

                {/* Footer Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.updateButton,
                            (!isFormValid || isLoading) && styles.updateButtonDisabled
                        ]}
                        disabled={!isFormValid || isLoading}
                        onPress={handleUpdate}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={[
                                styles.updateButtonText,
                                !isFormValid && styles.updateButtonTextDisabled
                            ]}>
                                Get Verification Code
                            </Text>
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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 40,
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
        marginBottom: 30,
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
    inputFocused: {
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    updateButton: {
        height: 50,
        backgroundColor: '#000',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    updateButtonDisabled: {
        backgroundColor: '#F0F0F0', // Grey background
    },
    updateButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    updateButtonTextDisabled: {
        color: '#999', // Grey text
    },
});

export default PasswordResetScreen;
