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
    Image
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import api from '@/services/api';
import { useLoader } from '@/contexts/LoaderContext';

function PasswordResetScreen() {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { showLoader, hideLoader } = useLoader();

    // Focus States
    const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

    // Validation
    const isFormValid = newPassword.length >= 8 && newPassword === confirmPassword;

    const handleUpdate = async () => {
        if (!isFormValid) return;

        showLoader();
        try {
            const response = await api.post('/api/user/account/reset-password/initiate');
            if (response.status === 200) {
                // Navigate to verification screen with the new password
                router.push({
                    pathname: './setting/account/VerifyPasswordResetScreen',
                    params: { newPassword }
                });
            }
        } catch (error: any) {
            console.error('Password reset initiation error:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to send verification code');
        } finally {
            hideLoader();
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
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../assets/images/settings-icons/reset_password_icon.png')}
                            style={styles.resetPasswordIcon}
                        />
                    </View>
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
                            (!isFormValid) && styles.updateButtonDisabled
                        ]}
                        disabled={!isFormValid}
                        onPress={handleUpdate}
                    >
                        <Text style={[
                            styles.updateButtonText,
                            !isFormValid && styles.updateButtonTextDisabled
                        ]}>
                            Get Verification Code
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
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 400,
        color: '#080808',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 40,
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    resetPasswordIcon: {
        width: 150,
        height: 108,
        marginBottom: 20,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 600,
        color: '#080808',
        marginBottom: 10,
    },
    instructionText: {
        fontSize: 14,
        fontWeight: 400,
        color: '#393939',
        lineHeight: 20,
        marginBottom: 30,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 400,
        color: '#080808',
        marginBottom: 8,
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
    },
    inputFocused: {
        borderColor: '#6B6B6B',
        backgroundColor: '#F0F0F0',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    updateButton: {
        height: 50,
        backgroundColor: '#080808',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    updateButtonDisabled: {
        backgroundColor: '#CECECE', // Grey background
    },
    updateButtonText: {
        fontSize: 16,
        fontWeight: 600,
        color: '#FFFFFF',
    },
    updateButtonTextDisabled: {
        color: '#979797',
        fontWeight: 600,
    },
});

export default PasswordResetScreen;
